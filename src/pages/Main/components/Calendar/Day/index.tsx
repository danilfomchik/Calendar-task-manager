import {motion} from 'framer-motion';
import moment from 'moment';
import {memo, useRef} from 'react';
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
  const [, setSearchParams] = useSearchParams();

  const {ref, isOpen, handleClose: handleModalClose, handleOpen: handleModalOpen} = useOpeningItem();
  const dispatch = useAppDispatch();

  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

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
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.5, ease: 'easeOut'}}
      className={cx(
        'group flex flex-col relative justify-between [&:not(:nth-child(7n))]:border-r border-b border-secondary-background-color p-1 lg:p-3 cursor-pointer transition-all md:hover:bg-secondaryBackgroundColorHover',
        {
          'bg-mainBackgroundColor': dateMonth !== currentMonth,
        },
        'max-md:bg-transparent max-md:border-none max-md:items-center',
      )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center md:gap-2 text-xs sm:text-base">
          <span
            className={cx(
              'rounded-full p-1 w-8 h-8 lg:w-8 lg:h-8 flex items-center justify-center text-white border border-transparent transition-colors',
              {
                'bg-blue-600 border-none': currentDate === date,
                'border-blue-500': date === selectedDate && isMobileScreen,
              },
            )}>
            <time dateTime={date}>{day}</time>
          </span>

          <Button
            kind="link"
            to={`/day/${date}`}
            className="p-0 bg-transparent border-none hidden md:group-hover:flex"
            startIcon={<ExternalPage size="size-5" />}
          />
        </div>

        <Button
          className="p-0 bg-transparent border-none hidden md:group-hover:flex"
          startIcon={<AddIcon size="size-5" />}
          onClick={handleModalOpen}
        />
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
