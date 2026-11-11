import moment from 'moment';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useMatch, useNavigate} from 'react-router';

import {useMediaQuery} from '@/hooks/useMediaQuery';
import {setFullDate, setSelectedDate} from '@/redux/date/dateSlice';
import {selectFullDate, selectMonth, selectSelectedDate, selectYear} from '@/redux/date/selectors';
import {selectAllEventsByDate} from '@/redux/events/selectors';
import {setIsOpenSidebar} from '@/redux/sidebar/sidebarSlice';
import {useAppDispatch} from '@/redux/store';
import {formatDate, generateDatesArray, getDate, getWeekDays} from '@/services/dateUtils';
import {cx} from '@/services/utils';
import {RouterPaths} from '@/types/types';

const DATE_FORMAT = 'YYYY-MM-DD';

const MONTH_CONTROL_CLASS =
  'flex size-11 md:size-7 cursor-pointer items-center justify-center border border-line-strong font-mono text-text-muted transition-colors hover:border-text-muted hover:text-text';

// the Viewed day, when the sidebar is shown on a valid Day page
const useViewedDay = () => {
  const date = useMatch(RouterPaths.day)?.params.date;

  return date && moment(date, DATE_FORMAT, true).isValid() ? date : null;
};

const getEventsLabel = (count: number) => (count === 1 ? '1 event' : `${count} events`);

const MonthSmallCalendar = ({className = ''}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

  const fullDate = useSelector(selectFullDate);
  const selectedDate = useSelector(selectSelectedDate);
  const year = useSelector(selectYear);
  const month = useSelector(selectMonth);
  const eventsByDate = useSelector(selectAllEventsByDate);

  const viewedDay = useViewedDay();

  // On the Day page the shown month follows the Viewed day (the URL), not the date slice, so browsing
  // here never moves Home's Month grid. The offset from the month-step buttons resets when the Viewed day changes.
  const [monthOffset, setMonthOffset] = useState({viewedDay, by: 0});
  const offset = monthOffset.viewedDay === viewedDay ? monthOffset.by : 0;

  const shownMonth = viewedDay ? moment(viewedDay, DATE_FORMAT).add(offset, 'M') : moment(fullDate, DATE_FORMAT);
  const shownYear = viewedDay ? formatDate(shownMonth, 'YYYY') : (year as string);
  const shownMonthName = viewedDay ? formatDate(shownMonth, 'MMMM') : (month as string);

  const dates = generateDatesArray(shownYear, shownMonthName);
  const weekDays = getWeekDays();
  const currentDate = formatDate(getDate(new Date()), DATE_FORMAT);
  const highlightedDate = viewedDay ?? selectedDate;

  const shiftShownMonth = (by: number) => setMonthOffset({viewedDay, by: offset + by});

  const handleDayClick = (date: string) => {
    if (viewedDay) {
      if (date !== viewedDay) navigate(`/day/${date}`);
    } else {
      // Home: select the date as a Month grid cell does; a day of a neighbouring month also brings that month into view
      if (!moment(date).isSame(shownMonth, 'month')) dispatch(setFullDate(date));

      dispatch(setSelectedDate(date));
    }

    // on mobile the sidebar covers the page, so get out of the way of what the click changed
    if (isMobileScreen) dispatch(setIsOpenSidebar(false));
  };

  return (
    <div className={cx('px-4 py-5', className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-widest text-text-faint" aria-live="polite">
          {shownMonthName} {shownYear}
        </p>

        {viewedDay && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous month"
              className={MONTH_CONTROL_CLASS}
              onClick={() => shiftShownMonth(-1)}>
              ‹
            </button>
            <button
              type="button"
              aria-label="Next month"
              className={MONTH_CONTROL_CLASS}
              onClick={() => shiftShownMonth(1)}>
              ›
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-px">
        {weekDays.map(weekday => (
          <span
            key={weekday}
            aria-hidden="true"
            className="flex justify-center pb-1 font-mono text-[11px] text-text-faint">
            {weekday.slice(0, 1)}
          </span>
        ))}

        {dates.map(date => {
          const day = formatDate(getDate(date), 'DD');
          const isOtherMonth = !moment(date).isSame(shownMonth, 'month');
          const isToday = currentDate === date;
          const isHighlighted = highlightedDate === date;
          const eventsCount = eventsByDate[date]?.length ?? 0;

          return (
            <button
              key={date}
              type="button"
              onClick={() => handleDayClick(date)}
              aria-label={`${formatDate(getDate(date), 'dddd D MMMM')}, ${getEventsLabel(eventsCount)}${isToday ? ', today' : ''}`}
              {...(viewedDay ? {'aria-current': isHighlighted ? 'date' : undefined} : {'aria-pressed': isHighlighted})}
              className={cx(
                'relative flex cursor-pointer flex-col items-center justify-center text-text-muted font-mono text-xs py-0.75 max-md:min-h-11 transition-colors hover:bg-surface-raised hover:text-text',
                {
                  'text-text-faint': isOtherMonth,
                  'text-info-ink bg-info font-medium hover:bg-info hover:text-info-ink': isToday,
                  'outline-1 -outline-offset-1 outline-action': isHighlighted && !viewedDay,
                  // the Viewed day is the page's subject, so it gets the stronger mark
                  'outline-2 -outline-offset-2 outline-action font-medium': isHighlighted && viewedDay,
                  'text-text': isHighlighted && viewedDay && !isToday,
                },
              )}>
              <time dateTime={date}>{day}</time>
              <span
                aria-hidden="true"
                className={cx('mt-0.5 size-1', {
                  invisible: eventsCount === 0,
                  'bg-text-muted': !isToday,
                  'bg-info-ink': isToday,
                })}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthSmallCalendar;
