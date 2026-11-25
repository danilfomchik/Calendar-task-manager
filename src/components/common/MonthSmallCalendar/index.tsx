import moment from 'moment';
import {KeyboardEvent, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {useMatch, useNavigate} from 'react-router';

import ArrowLeft from '@/components/ui/icons/ArrowLeft';
import ArrowRight from '@/components/ui/icons/ArrowRight';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {useAgendaPanelActions} from '@/pages/Main/AgendaPanelContext';
import {setFullDate} from '@/redux/date/dateSlice';
import {selectFullDate, selectSelectedDate, selectTodayRequests} from '@/redux/date/selectors';
import {selectAllEventsByDate} from '@/redux/events/selectors';
import {setIsOpenSidebar} from '@/redux/sidebar/sidebarSlice';
import {useAppDispatch} from '@/redux/store';
import {
  DATE_KEY_FORMAT,
  formatDate,
  formatEventsCount,
  generateDatesArray,
  getDate,
  getDayPath,
  getTodayKey,
  getWeekDaysMin,
} from '@/services/dateUtils';
import {gridArrowSteps} from '@/services/gridKeyboard';
import {HAIRLINE_CONTROL_BASE_CLASS} from '@/services/styles';
import {cx} from '@/services/utils';
import {RouterPaths} from '@/types/types';

import {TMonthSmallCalendarProps} from './types';

const MONTH_CONTROL_CLASS = cx(HAIRLINE_CONTROL_BASE_CLASS, 'flex size-11 md:size-7');

const DAYS_IN_WEEK = 7;

// Arrow keys move the roving focus by a day or a week; Home / End go to the start / end of the row (week)
const ARROW_STEPS = gridArrowSteps(DAYS_IN_WEEK);
const ROW_EDGE_STEPS: Record<string, (index: number) => number> = {
  Home: i => i - (i % DAYS_IN_WEEK),
  End: i => i - (i % DAYS_IN_WEEK) + DAYS_IN_WEEK - 1,
};

const keyStep = (key: string): ((index: number) => number) | undefined =>
  key in ARROW_STEPS ? i => i + ARROW_STEPS[key] : ROW_EDGE_STEPS[key];

// the Viewed day, when the sidebar is shown on a valid Day page
const useViewedDay = () => {
  const date = useMatch(RouterPaths.day)?.params.date;

  return date && moment(date, DATE_KEY_FORMAT, true).isValid() ? date : null;
};

const MonthSmallCalendar = ({className = ''}: TMonthSmallCalendarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {openFor} = useAgendaPanelActions();
  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

  const fullDate = useSelector(selectFullDate);
  const selectedDate = useSelector(selectSelectedDate);
  const eventsByDate = useSelector(selectAllEventsByDate);

  const viewedDay = useViewedDay();
  const todayRequests = useSelector(selectTodayRequests);

  // The shown month starts from the Viewed day (Day page) or Home's visible month, and the month-step buttons
  // browse from there without moving Home's Month grid. The offset resets when that anchor changes or Today is requested.
  const anchor = viewedDay ?? fullDate;
  const [monthOffset, setMonthOffset] = useState({anchor, todayRequests, by: 0});
  const isOffsetCurrent = monthOffset.anchor === anchor && monthOffset.todayRequests === todayRequests;
  const offset = isOffsetCurrent ? monthOffset.by : 0;

  const shownMonth = moment(anchor, DATE_KEY_FORMAT).add(offset, 'M');
  const shownYear = formatDate(shownMonth, 'YYYY');
  const shownMonthName = formatDate(shownMonth, 'MMMM');
  // Announced on the Day page, and on Home only when the month-step buttons browse: Home's own status region
  // (MonthAnnouncer) already names the Visible month when it changes, so the mini-calendar following it stays quiet.
  // A stale offset means the anchor moved since the last browse, so the region empties (silently) instead.
  const liveMonthLabel = viewedDay || isOffsetCurrent ? `${shownMonthName} ${shownYear}` : '';

  const dates = generateDatesArray(shownYear, shownMonthName);
  // two letters, as the Month grid: single initials repeat (T T, S S)
  const weekDays = getWeekDaysMin();
  const todayKey = getTodayKey();
  const highlightedDate = viewedDay ?? selectedDate;

  // Roving tabindex: the grid is one tab stop. It sits on the day the arrow keys last reached (until the
  // highlighted day changes), else the highlighted day, else today, else the 1st of the shown month.
  const [roving, setRoving] = useState<{date: string; highlightedDate: string} | null>(null);
  const rovingDate = roving?.highlightedDate === highlightedDate ? roving.date : null;
  const setRovingDate = (date: string) => setRoving({date, highlightedDate});
  const tabStopDate =
    [rovingDate, highlightedDate, todayKey].find(date => date && dates.includes(date)) ??
    formatDate(shownMonth.clone().startOf('month'), DATE_KEY_FORMAT);
  const dayButtons = useRef(new Map<string, HTMLButtonElement>());

  const shiftShownMonth = (by: number) => setMonthOffset({anchor, todayRequests, by: offset + by});

  const handleDayClick = (date: string) => {
    if (viewedDay) {
      if (date !== viewedDay) navigate(getDayPath(date));

      // on mobile the sidebar covers the Day page, so get out of the way of the day just opened
      if (isMobileScreen) dispatch(setIsOpenSidebar(false));

      return;
    }

    // Home: select the date and open the Agenda panel for it, as a Month grid cell does; a day outside the
    // grid's month also brings its month into view
    if (!moment(date).isSame(fullDate, 'month')) dispatch(setFullDate(date));

    openFor(date);
  };

  const handleGridKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = keyStep(e.key);
    const index = dates.indexOf(tabStopDate);

    if (!step || index === -1) return;

    e.preventDefault();

    // stays within the shown six weeks; the month-step buttons (Day page) or Home's header change the month
    const next = dates[Math.min(Math.max(step(index), 0), dates.length - 1)];

    setRovingDate(next);
    dayButtons.current.get(next)?.focus();
  };

  return (
    <div className={cx('px-3 py-5 md:px-4', className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-caption text-text-faint">
          {shownMonthName} {shownYear}
        </p>
        <span aria-live="polite" className="sr-only">
          {liveMonthLabel}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            className={MONTH_CONTROL_CLASS}
            onClick={() => shiftShownMonth(-1)}>
            <ArrowLeft size="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next month"
            className={MONTH_CONTROL_CLASS}
            onClick={() => shiftShownMonth(1)}>
            <ArrowRight size="size-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px" onKeyDown={handleGridKeyDown}>
        {weekDays.map(weekday => (
          <span key={weekday} aria-hidden="true" className="flex justify-center pb-1 text-caption text-text-faint">
            {weekday}
          </span>
        ))}

        {dates.map(date => {
          const day = formatDate(getDate(date), 'D');
          const isOtherMonth = !moment(date).isSame(shownMonth, 'month');
          const isToday = todayKey === date;
          const isHighlighted = highlightedDate === date;
          const eventsCount = eventsByDate[date]?.length ?? 0;
          const hasEvents = eventsCount > 0;

          return (
            <button
              key={date}
              ref={button => {
                if (button) dayButtons.current.set(date, button);
                else dayButtons.current.delete(date);
              }}
              type="button"
              tabIndex={date === tabStopDate ? 0 : -1}
              onClick={() => handleDayClick(date)}
              aria-label={`${formatDate(getDate(date), 'dddd D MMMM')}, ${formatEventsCount(eventsCount)}${isToday ? ', today' : ''}`}
              {...(viewedDay ? {'aria-current': isHighlighted ? 'date' : undefined} : {'aria-pressed': isHighlighted})}
              className={cx(
                'relative flex cursor-pointer flex-col items-center justify-center text-text-muted text-caption font-normal tabular-nums py-1 max-md:min-h-11 transition-colors hover:bg-surface-raised hover:text-text focus-visible:z-10',
                {
                  // As the Month grid, weight carries the day's load (typography.md): bold on a day with events,
                  // regular when empty, regular and faint for a neighbouring month's day
                  'font-bold text-text': hasEvents && !isOtherMonth,
                  'text-text-faint': isOtherMonth,
                  // The Month grid's split: selection is the cell's 2px green frame, today the numeral's blue fill, so a
                  // selected today is frame plus fill, never a ring on the fill. On the Day page the Viewed day, the
                  // page's subject, also takes full-strength text.
                  'outline-2 -outline-offset-2 outline-action': isHighlighted,
                  'text-text': isHighlighted && viewedDay && !isToday,
                },
              )}>
              <time
                dateTime={date}
                className={cx('flex h-4 min-w-5 items-center justify-center px-0.5', {
                  'bg-info text-info-ink': isToday,
                })}>
                {day}
              </time>
              <span aria-hidden="true" className={cx('mt-0.5 size-1 bg-text-muted', {invisible: !hasEvents})} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthSmallCalendar;
