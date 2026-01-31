import cn from 'classnames';
import {motion} from 'framer-motion';
import moment from 'moment';
import {memo, useMemo, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {twMerge} from 'tailwind-merge';

import Button from '@/components/Button';
import EventForm from '@/components/EventForm';
import Modal from '@/components/Modal';
import {useOpeningItem} from '@/hooks/useOpeningItem';
import {useScreenSize} from '@/hooks/useScreenSize';
import AddIcon from '@/icons/AddIcon';
import ExternalPage from '@/icons/ExternalPage';
import {setSelectedDate} from '@/redux/date/dateSlice';
import {selectFullDate, selectSelectedDate} from '@/redux/date/selectors';
import {selectEventsByDate, selectEventsById} from '@/redux/events/selectors';
import {useAppDispatch} from '@/redux/store';
import {formatDate, getDate} from '@/services/dateUtils';

import DayEventsList from './DayEventsList';
import {TDayProps} from './types';

const Day = ({date}: TDayProps) => {
  const [isHover, setIsHover] = useState(false);
  const {ref, isOpen, handleClose: handleModalClose, handleOpen: handleModalOpen} = useOpeningItem();
  const dispatch = useAppDispatch();
  const screenSize = useScreenSize();

  const isMobileScreen = screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md';

  const dayRef = useRef<HTMLDivElement>(null);

  const eventsByDate = useSelector(selectEventsByDate(date));
  const eventsById = useSelector(selectEventsById);
  const selectedDate = useSelector(selectSelectedDate);

  const events = useMemo(() => eventsByDate?.map(eventDate => eventsById[eventDate]), [eventsByDate, eventsById]);

  const fullDate = useSelector(selectFullDate);
  const currentMonth = formatDate(moment(fullDate), 'M');
  const dateMonth = formatDate(moment(date), 'M');

  const currentDate = formatDate(getDate(new Date()), 'YYYY-MM-DD');
  const day = formatDate(getDate(date), 'DD');

  const handleDayClick = () => {
    if (!isMobileScreen) return;

    dispatch(setSelectedDate(date));
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
      className={twMerge(
        cn(
          'flex flex-col relative justify-between border border-secondaryBackgroundColor rounded-md p-1 lg:p-3 cursor-pointer transition-all',
          {
            'bg-secondaryBackgroundColor': dateMonth !== currentMonth,
          },
          {'bg-secondaryBackgroundColorHover': isHover},
          {'border border-sky-500': date === selectedDate && isMobileScreen},
        ),
      )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs sm:text-base">
          <span
            className={twMerge(
              cn('rounded-full p-1 w-5 h-5 lg:w-8 lg:h-8 flex items-center justify-center text-white', {
                'bg-blue-600': currentDate === date,
              }),
            )}>
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
