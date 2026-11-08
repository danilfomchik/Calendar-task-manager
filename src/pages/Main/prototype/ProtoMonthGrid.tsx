// PROTOTYPE: month grid (6x7) for desktop and mobile, plus the week strip with edge cues.
import {useDragControls} from 'motion/react';
import {useCallback, useRef} from 'react';
import {useSelector} from 'react-redux';

import SwipeSlide from '@/components/common/SwipeSlide';
import {shiftMonth, shiftWeek} from '@/redux/date/dateSlice';
import {selectFullDate, selectMonth, selectWeekStart, selectYear} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {
  TDirection,
  WEEK_LENGTH,
  formatDate,
  generateDatesArray,
  generateWeekDates,
  getDate,
  getWeekDays,
  shiftDate,
} from '@/services/dateUtils';
import {cx} from '@/services/utils';

import {DesktopDayCell, MobileDayCell} from './ProtoDayCell';
import {todayStr} from './shared';

export const ProtoWeekdays = ({mode}: {mode: 'desktop' | 'mobile'}) => (
  <div
    className={cx('proto-mono grid shrink-0 grid-cols-7 text-[11px] uppercase tracking-widest text-(--text-faint)', {
      'border-b border-l border-(--line) border-l-transparent': mode === 'desktop',
      'py-1.5 text-center': mode === 'mobile',
    })}>
    {getWeekDays().map(day => (
      <span
        key={day}
        className={cx({
          // same box model as a day cell (border-r + p-1.5) and the numeral's inner offset, so labels sit over the numerals
          'border-r border-(--line) py-2 pr-1.5 pl-2.5': mode === 'desktop',
        })}>
        {mode === 'desktop' ? day.slice(0, 3) : day.slice(0, 1)}
      </span>
    ))}
  </div>
);

type TGridProps = {
  mode: 'desktop' | 'mobile';
  selectedDate: string;
  onSelect: (date: string) => void;
  onMore?: (date: string, anchor: HTMLElement) => void;
  showOpenDay?: boolean;
  className?: string;
};

export const ProtoMonthGrid = ({mode, selectedDate, onSelect, onMore, showOpenDay, className}: TGridProps) => {
  const dispatch = useAppDispatch();
  const year = useSelector(selectYear);
  const month = useSelector(selectMonth);
  const fullDate = useSelector(selectFullDate);

  const today = todayStr();
  const visibleMonth = fullDate.slice(0, 7);
  const Cell = mode === 'desktop' ? DesktopDayCell : MobileDayCell;

  const cells = generateDatesArray(year as string, month as string).map(date => (
    <Cell
      key={date}
      date={date}
      isOutside={date.slice(0, 7) !== visibleMonth}
      isToday={date === today}
      isSelected={date === selectedDate}
      onSelect={onSelect}
      onMore={onMore}
      showOpenDay={showOpenDay}
    />
  ));

  const gridClass = cx('grid h-full w-full grid-cols-7 grid-rows-6', className);

  if (mode === 'desktop')
    return <div className={cx(gridClass, 'min-h-0 flex-1 border-l border-(--line)')}>{cells}</div>;

  // Month swipe: mobile only, same as the current grid
  return (
    <div className={cx('w-full touch-pan-y overflow-hidden', className)}>
      <SwipeSlide
        slideKey={visibleMonth}
        onSwipe={direction => dispatch(shiftMonth(direction))}
        className="grid h-full w-full grid-cols-7 grid-rows-6">
        {cells}
      </SwipeSlide>
    </div>
  );
};

// a click right after a drag is the tail of that same gesture, not a tap
const CLICK_AFTER_DRAG_WINDOW_MS = 150;

const dayLabel = (date: string) => formatDate(getDate(date), 'DD');

export const ProtoWeekStrip = ({selectedDate, onSelect}: {selectedDate: string; onSelect: (date: string) => void}) => {
  const dispatch = useAppDispatch();
  const dragControls = useDragControls();
  const lastDragEndRef = useRef(0);
  const weekStart = useSelector(selectWeekStart);
  const fullDate = useSelector(selectFullDate);

  const today = todayStr();
  const visibleMonth = fullDate.slice(0, 7);

  const cues = [
    {direction: -1, label: 'Previous week', day: dayLabel(shiftDate(weekStart, -1)), position: 'right-full'},
    {direction: 1, label: 'Next week', day: dayLabel(shiftDate(weekStart, WEEK_LENGTH)), position: 'left-full'},
  ] as const;

  const handleCue = useCallback(
    (direction: TDirection) => {
      if (performance.now() - lastDragEndRef.current < CLICK_AFTER_DRAG_WINDOW_MS) return;
      dispatch(shiftWeek(direction));
    },
    [dispatch],
  );

  return (
    <div className="relative w-full touch-pan-y">
      {cues.map(({direction, label, day, position}) => (
        <button
          key={direction}
          type="button"
          aria-label={label}
          onPointerDown={e => dragControls.start(e)}
          onClick={() => handleCue(direction)}
          className={cx(
            'proto-display absolute inset-y-0 flex w-10 touch-pan-y items-start justify-center pt-2 text-xl text-(--text-faint) opacity-60 active:text-(--text-muted)',
            position,
          )}>
          {day}
        </button>
      ))}

      <div className="w-full overflow-hidden">
        <SwipeSlide
          slideKey={weekStart}
          dragControls={dragControls}
          onSwipe={direction => dispatch(shiftWeek(direction))}
          onDragFinish={() => (lastDragEndRef.current = performance.now())}
          className="grid w-full grid-cols-7">
          {generateWeekDates(weekStart).map(date => (
            <MobileDayCell
              key={date}
              date={date}
              isOutside={date.slice(0, 7) !== visibleMonth}
              isToday={date === today}
              isSelected={date === selectedDate}
              onSelect={onSelect}
            />
          ))}
        </SwipeSlide>
      </div>
    </div>
  );
};
