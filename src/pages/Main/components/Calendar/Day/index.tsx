import {motion} from 'framer-motion';
import moment from 'moment';
import {memo, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {useSearchParams} from 'react-router';

import Button from '@/components/common/Button';
import EventForm from '@/components/common/EventForm';
import Modal from '@/components/common/Modal';
import AddIcon from '@/components/ui/icons/AddIcon';
import ExternalPage from '@/components/ui/icons/ExternalPage';
import {useEventsList} from '@/hooks/useEventsList';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {useOpeningItem} from '@/hooks/useOpeningItem';
import {setSelectedDate} from '@/redux/date/dateSlice';
import {selectFullDate, selectSelectedDate} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {CURRENT_DATE_PARAMS_KEY} from '@/services/constants';
import {formatDate, getDate} from '@/services/dateUtils';
import {cx} from '@/services/utils';

import DayEventsList from './DayEventsList';
import {TDayProps} from './types';

const Day = ({date}: TDayProps) => {
  const [isHover, setIsHover] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const {ref, isOpen, handleClose: handleModalClose, handleOpen: handleModalOpen} = useOpeningItem();
  const dispatch = useAppDispatch();

  const isMobileScreen = useMediaQuery({size: 'md', direction: 'to'});

  const dayRef = useRef<HTMLDivElement>(null);

  const events = useEventsList(date);
  const selectedDate = useSelector(selectSelectedDate);
  const fullDate = useSelector(selectFullDate);
  const currentMonth = formatDate(moment(fullDate), 'M');
  const dateMonth = formatDate(moment(date), 'M');

  const currentDate = formatDate(getDate(new Date()), 'YYYY-MM-DD');
  const day = formatDate(getDate(date), 'DD');

  const handleDayClick = () => {
    if (!isMobileScreen) return;

    dispatch(setSelectedDate(date));
    setSearchParams(`?${CURRENT_DATE_PARAMS_KEY}=${date}`);
  };

  return (
    <motion.div
      ref={dayRef}
      onClick={handleDayClick}
      // on hover
      onPointerEnter={e => {
        if (e.pointerType === 'mouse') {
          setIsHover(true);
        }
      }}
      // on blur
      onPointerLeave={() => setIsHover(false)}
      // on move not inside day block (ex. modal)
      onPointerMoveCapture={e => {
        if (!dayRef.current?.contains(e.target as Node)) {
          setIsHover(false);
        }
      }}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.5, ease: 'easeOut'}}
      className={cx(
        'flex flex-col relative justify-between border border-secondary-background-color rounded-md p-1 lg:p-3 cursor-pointer transition-all',
        {
          'bg-secondary-background-color': dateMonth !== currentMonth,
        },
        {'bg-secondaryBackgroundColorHover': isHover},
        {'border border-sky-500': date === selectedDate && isMobileScreen},
      )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs sm:text-base">
          <span
            className={cx('rounded-full p-1 w-5 h-5 lg:w-8 lg:h-8 flex items-center justify-center text-white', {
              'bg-blue-600': currentDate === date,
            })}>
            <time dateTime={date}>{day}</time>
          </span>

          {isHover && (
            <Button
              kind="link"
              to={`/day/${date}`}
              className="p-0 bg-transparent border-none"
              startIcon={<ExternalPage size="size-5" />}
            />
          )}
        </div>

        {isHover && (
          <Button
            className="p-0 bg-transparent border-none"
            startIcon={<AddIcon size="size-5" />}
            onClick={handleModalOpen}
          />
        )}
      </div>

      {!!events?.length && <DayEventsList events={events || []} />}

      {isOpen && (
        <Modal refItem={ref} onClose={handleModalClose}>
          <EventForm formTitle="Create event form" handleModalClose={handleModalClose} date={date} />
        </Modal>
      )}
    </motion.div>
  );
};

export default memo(Day);
