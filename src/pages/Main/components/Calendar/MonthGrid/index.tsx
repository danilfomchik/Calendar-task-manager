import moment from 'moment';
import {KeyboardEvent, Suspense, lazy, useRef} from 'react';
import {useSelector} from 'react-redux';

import {useMediaQuery} from '@/hooks/useMediaQuery';
import EmptyMonthNote from '@/pages/Main/components/EmptyMonthNote';
import {dayCellSelector} from '@/pages/Main/dayCell';
import {shiftMonth} from '@/redux/date/dateSlice';
import {selectFullDate, selectMonth, selectSelectedDate, selectYear} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {formatDate, generateDatesArray, getTodayKey, getYearMonthKey} from '@/services/dateUtils';

import Day from '../Day';
import {DAYS_IN_WEEK, GRID_ARROW_STEPS} from './constants';
import {useCompactCells} from './useCompactCells';

const GRID_CLASS = 'grid grid-rows-6 grid-cols-7 w-full min-h-71.5 h-full md:border-l border-line';

// Month swipe is mobile-only and needs `motion` (drag), so it loads on demand; until it arrives the same rows render
// in a plain grid of the same class, and the slide itself doesn't animate on mount, so nothing visibly changes
const SwipeSlide = lazy(() => import('@/components/common/SwipeSlide'));

const MonthGrid = () => {
  const dispatch = useAppDispatch();

  const year = useSelector(selectYear);
  const month = useSelector(selectMonth);
  const fullDate = useSelector(selectFullDate);
  const selectedDate = useSelector(selectSelectedDate);
  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

  const gridRef = useRef<HTMLDivElement>(null);
  // desktop cells too narrow for chips show calendar-coloured bars instead
  const isCompact = useCompactCells(gridRef, !isMobileScreen);

  const dates = generateDatesArray(year as string, month as string);
  // the grid is a single tab stop: the selected day when it is shown, otherwise the Visible month's 1st
  const tabStop = dates.includes(selectedDate)
    ? selectedDate
    : formatDate(moment(fullDate).startOf('month'), 'YYYY-MM-DD');

  // computed once for the grid and passed down as plain props, so memo(Day) skips the cells that didn't change
  const today = getTodayKey();
  const visibleMonth = getYearMonthKey(fullDate);

  const cells = dates.map(date => (
    <Day
      key={date}
      date={date}
      isTabStop={date === tabStop}
      isSelected={date === selectedDate}
      isToday={date === today}
      isOutsideMonth={getYearMonthKey(date) !== visibleMonth}
      isMobileScreen={isMobileScreen}
      isCompact={isCompact}
    />
  ));

  // A grid for assistive tech (role grid / row / gridcell), so a screen reader announces the arrow-key navigation and
  // switches to focus mode for it. The rows are `display: contents`, so the cells stay items of the 7-column CSS grid.
  // No column headers: each numeral's label already names its weekday, and WeekDays sits outside the grid.
  const weeks = Array.from({length: Math.ceil(cells.length / DAYS_IN_WEEK)}, (_, week) => (
    <div key={dates[week * DAYS_IN_WEEK]} role="row" className="contents">
      {cells.slice(week * DAYS_IN_WEEK, (week + 1) * DAYS_IN_WEEK)}
    </div>
  ));

  const gridLabel = `${month} ${year}`;

  // Arrow keys move focus between the day numerals (a week per row); Enter or Space then selects the day. Focus stops
  // at the grid's edges instead of changing the month. Same on mobile, for a phone keyboard or switch user.
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = GRID_ARROW_STEPS[e.key];
    const current = (e.target as HTMLElement).closest<HTMLElement>('[data-day]')?.dataset.day;

    if (!step || !current || e.altKey || e.metaKey || e.ctrlKey || e.shiftKey) return;

    e.preventDefault();

    const next = dates[dates.indexOf(current) + step];

    if (next) e.currentTarget.querySelector<HTMLElement>(dayCellSelector(next))?.focus();
  };

  // Month swipe is mobile-only; desktop keeps the plain grid
  if (!isMobileScreen) {
    return (
      // the empty-month note sits under the month title in the header on desktop (Header/CalendarDatePicker)
      <div ref={gridRef} role="grid" aria-label={gridLabel} className={GRID_CLASS} onKeyDown={handleKeyDown}>
        {weeks}
      </div>
    );
  }

  return (
    // the grid role sits on the swipe's frame; the sliding layer between it and the rows is a plain div, which assistive
    // tech passes over. The empty-month note sits beside the frame (a grid holds only rows).
    <div className="relative flex w-full min-h-0 flex-1 flex-col">
      <div
        role="grid"
        aria-label={gridLabel}
        className="w-full min-h-0 flex-1 overflow-hidden touch-pan-y"
        onKeyDown={handleKeyDown}>
        <Suspense fallback={<div className={GRID_CLASS}>{weeks}</div>}>
          <SwipeSlide
            slideKey={visibleMonth}
            onSwipe={direction => dispatch(shiftMonth(direction))}
            className={GRID_CLASS}>
            {weeks}
          </SwipeSlide>
        </Suspense>
      </div>
      {/* in the gap between the third week's numerals and the fourth's (mobile cells have no borders, so it needs no
          box): the gap's centre sits half the numeral head above the row boundary, 8px on a regular phone and 2px on a
          short one, where the 44px rows leave 2px either side. Only shown when the month is empty, so no dots sit
          under it. leading-none so that centring maths works on the glyphs, not the caption's taller line box */}
      <EmptyMonthNote className="absolute top-1/2 left-1/2 -mt-2 -translate-x-1/2 -translate-y-1/2 leading-none whitespace-nowrap [@media(max-height:759px)]:-mt-0.5" />
    </div>
  );
};

export default MonthGrid;
