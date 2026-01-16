import cn from 'classnames';
import {motion} from 'framer-motion';
import moment from 'moment';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {twMerge} from 'tailwind-merge';

import Button from '@/components/Button';
import Modal from '@/components/Modal';
import BoardEventForm from '@/components/forms/BoardEventForm';
import AddIcon from '@/icons/AddIcon';
import {selectFullDate} from '@/redux/date/selectors';
import {selectEventsByDate} from '@/redux/events/selectors';
import {formatDate, getDate} from '@/services/dateUtils';
import {useOpeningItem} from '@/services/hooks';

import DayEventsList from './DayEventsList';
import {TDayProps} from './types';

const Day = ({date}: TDayProps) => {
  const [isHover, setIsHover] = useState(false);
  const {ref, isOpen, handleClose: handleModalClose, handleOpen: handleModalOpen} = useOpeningItem();

  const events = useSelector(selectEventsByDate(date));
  const fullDate = useSelector(selectFullDate);
  const currentMonth = formatDate(moment(fullDate), 'M');
  const dateMonth = formatDate(moment(date), 'M');

  const currentDate = formatDate(getDate(new Date()), 'YYYY-MM-DD');
  const day = formatDate(getDate(date), 'DD');

  return (
    <motion.div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.5, ease: 'easeOut'}}
      className={twMerge(
        cn(
          'flex flex-col relative justify-between border border-secondaryBackgroundColor rounded-md p-1 md:p-3 cursor-pointer hover:bg-secondaryBackgroundColorHover',
          {
            'bg-secondaryBackgroundColor': dateMonth !== currentMonth,
          },
        ),
      )}>
      <div className="flex items-center justify-between">
        <div className="text-xs sm:text-base">
          <span
            className={twMerge(
              cn('rounded-full p-1 w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center text-white', {
                'bg-blue-600': currentDate === date,
              }),
            )}>
            <time dateTime={date}>{day}</time>
          </span>
        </div>

        {isHover && (
          <Button
            className="p-0 bg-transparent border-none"
            startIcon={<AddIcon size="size-5" />}
            onClick={handleModalOpen}
          />
        )}
      </div>

      {events?.length && <DayEventsList events={events || []} />}

      {isOpen && (
        <Modal refItem={ref} onClose={handleModalClose}>
          <BoardEventForm
            actionType="add"
            formTitle="Create new event"
            date={date}
            handleModalClose={handleModalClose}
          />
        </Modal>
      )}
    </motion.div>
  );
};

export default Day;
