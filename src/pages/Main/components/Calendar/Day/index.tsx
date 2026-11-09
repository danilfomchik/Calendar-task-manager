import moment from 'moment';
import {memo, useRef} from 'react';
import {useSelector} from 'react-redux';
import {useSearchParams} from 'react-router';

import DottedEventsList from '@/components/common/DottedEventsList';
import {useEventsList} from '@/hooks/useEventsList';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {setSelectedDate} from '@/redux/date/dateSlice';
import {selectFullDate, selectSelectedDate} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {CURRENT_DATE_PARAMS_KEY} from '@/services/constants';
import {formatDate, getDate} from '@/services/dateUtils';
import {cx} from '@/services/utils';

import {useAgendaPanel} from '../../../AgendaPanelContext';
import DayEventsList from './DayEventsList';
import {TDayProps} from './types';

const Day = ({date}: TDayProps) => {
  const [, setSearchParams] = useSearchParams();

  const dispatch = useAppDispatch();
  const {openFor} = useAgendaPanel();

  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

  const dayRef = useRef<HTMLDivElement>(null);

  const events = useEventsList(date) || [];
  const selectedDate = useSelector(selectSelectedDate);
  const fullDate = useSelector(selectFullDate);
  const currentMonth = formatDate(moment(fullDate), 'M');
  const dateMonth = formatDate(moment(date), 'M');

  const currentDate = formatDate(getDate(new Date()), 'YYYY-MM-DD');
  // mobile numerals have no leading zero (matches the prototype)
  const day = formatDate(getDate(date), isMobileScreen ? 'D' : 'DD');

  const handleDayClick = () => {
    if (!isMobileScreen) {
      openFor(date);

      return;
    }

    const isCurrentDate = date === fullDate;

    dispatch(setSelectedDate(isCurrentDate ? currentDate : date));
    setSearchParams(isCurrentDate ? '' : `?${CURRENT_DATE_PARAMS_KEY}=${date}`);
  };

  return (
    <div
      ref={dayRef}
      onClick={handleDayClick}
      className={cx(
        'group flex flex-col gap-1 relative min-h-0 min-w-0 border-r border-b border-line p-1.5 transition-colors cursor-default',
        {
          'bg-surface-sunken': dateMonth !== currentMonth,
          'md:hover:bg-surface-raised': true,
          'z-10 outline-2 -outline-offset-2 outline-action': date === selectedDate,
        },
        'max-md:border-none max-md:items-center max-md:justify-start max-md:min-h-11 max-md:gap-1.5 max-md:p-0 max-md:pt-1.5',
      )}>
      <div className="flex items-center justify-between md:h-7 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            tabIndex={isMobileScreen ? -1 : 0}
            aria-pressed={date === selectedDate}
            aria-label={`${formatDate(getDate(date), 'dddd D MMMM')}, ${events.length === 1 ? '1 event' : `${events.length} events`}`}
            onClick={e => {
              e.stopPropagation();
              handleDayClick();
            }}
            className={cx(
              'cursor-pointer font-display font-extrabold tracking-tight text-xl md:text-[22px] leading-none px-1 min-w-8 h-8 md:min-w-7 md:h-7 flex items-center justify-center text-text transition-colors',
              {
                'underline decoration-action decoration-2 underline-offset-4':
                  date === selectedDate && currentDate !== date,
                'text-text-faint': dateMonth !== currentMonth,
                'bg-info text-info-ink': currentDate === date,
              },
            )}>
            <time dateTime={date}>{day}</time>
          </button>
        </div>

        {events.length > 0 && !isMobileScreen && (
          <span className="font-mono border border-line-strong px-1 text-[10px] leading-4 text-text-muted">
            {events.length}
          </span>
        )}
      </div>

      {isMobileScreen ? <DottedEventsList events={events} /> : <DayEventsList date={date} events={events} />}
    </div>
  );
};

export default memo(Day);
