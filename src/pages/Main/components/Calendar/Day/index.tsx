import {motion} from 'framer-motion';
import moment from 'moment';
import {memo, useRef} from 'react';
import {useSelector} from 'react-redux';
import {useSearchParams} from 'react-router';

import Button from '@/components/common/Button';
import AddIcon from '@/components/ui/icons/AddIcon';
import ExternalPage from '@/components/ui/icons/ExternalPage';
import {useEventsList} from '@/hooks/useEventsList';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {setSelectedDate} from '@/redux/date/dateSlice';
import {selectFullDate, selectSelectedDate} from '@/redux/date/selectors';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {CURRENT_DATE_PARAMS_KEY, EVENT_FORM_ID} from '@/services/constants';
import {formatDate, getDate} from '@/services/dateUtils';
import {cx} from '@/services/utils';
import {FormActionType} from '@/types/eventFormTypes';

import DayEventsList from './DayEventsList';
import {TDayProps} from './types';

const Day = ({date}: TDayProps) => {
  const [, setSearchParams] = useSearchParams();

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

    const isCurrentDate = date === fullDate;

    dispatch(setSelectedDate(isCurrentDate ? currentDate : date));
    setSearchParams(isCurrentDate ? '' : `?${CURRENT_DATE_PARAMS_KEY}=${date}`);
  };

  const handleOpen = () => {
    dispatch(onOpenItem(EVENT_FORM_ID));
    dispatch(setEventFormData({actionType: FormActionType.create, date}));
  };

  return (
    <motion.div
      tabIndex={-1}
      role="button"
      ref={dayRef}
      onClick={handleDayClick}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.5, ease: 'easeOut'}}
      className={cx(
        'group flex flex-col gap-2 relative justify-between not-nth-[7n]:border-r border-b border-secondary-background-color p-1 lg:p-3 transition-all cursor-default',
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
                'border-blue-500': date === selectedDate && isMobileScreen,
                'text-[#444444]': dateMonth !== currentMonth,
                'bg-blue-600 border-none text-white': currentDate === date,
              },
            )}>
            <time dateTime={date}>{day}</time>
          </span>

          <Button
            title="Open day page"
            kind="link"
            to={`/day/${date}`}
            className="p-0 bg-transparent border-none max-md:hidden invisible opacity-0 transition-all md:group-hover:visible md:group-hover:opacity-100"
            startIcon={<ExternalPage size="size-5" />}
          />
        </div>

        <Button
          title="Create event"
          className="p-0 bg-transparent border-none max-md:hidden invisible opacity-0 transition-all md:group-hover:visible md:group-hover:opacity-100"
          startIcon={<AddIcon size="size-5" />}
          onClick={handleOpen}
        />
      </div>

      <DayEventsList date={date} events={events || []} />
    </motion.div>
  );
};

export default memo(Day);
