import {useDragControls} from 'motion/react';
import {useRef} from 'react';
import {useSelector} from 'react-redux';

import SwipeSlide from '@/components/common/SwipeSlide';
import {shiftWeek} from '@/redux/date/dateSlice';
import {selectWeekStart} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {TDirection, WEEK_LENGTH, formatDate, generateWeekDates, getDate, shiftDate} from '@/services/dateUtils';
import {cx} from '@/services/utils';

import Day from '../../Day';

const EDGE_CUE_CLASS_NAME =
  'absolute inset-y-0 w-10 flex items-start justify-center pt-1 touch-pan-y rounded text-xs sm:text-base text-white/25 active:text-white/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70';

// a click right after a drag is the tail of that same gesture, not a tap
const CLICK_AFTER_DRAG_WINDOW_MS = 150;

const getDayLabel = (date: string) => formatDate(getDate(date), 'DD');

const WeekStrip = () => {
  const dispatch = useAppDispatch();

  const dragControls = useDragControls();
  const lastDragEndRef = useRef(0);

  const weekStart = useSelector(selectWeekStart);

  const edgeCues = [
    {direction: -1, label: 'Previous week', day: getDayLabel(shiftDate(weekStart, -1)), position: 'right-full'},
    {direction: 1, label: 'Next week', day: getDayLabel(shiftDate(weekStart, WEEK_LENGTH)), position: 'left-full'},
  ] as const;

  const handleCueClick = (direction: TDirection) => {
    if (performance.now() - lastDragEndRef.current < CLICK_AFTER_DRAG_WINDOW_MS) return;

    dispatch(shiftWeek(direction));
  };

  return (
    <div className="relative w-full touch-pan-y">
      {edgeCues.map(({direction, label, day, position}) => (
        <button
          key={direction}
          type="button"
          aria-label={label}
          onPointerDown={e => dragControls.start(e)}
          onClick={() => handleCueClick(direction)}
          className={cx(EDGE_CUE_CLASS_NAME, position)}>
          <span className="flex items-center h-8">{day}</span>
        </button>
      ))}

      <div className="w-full overflow-hidden">
        <SwipeSlide
          slideKey={weekStart}
          dragControls={dragControls}
          onSwipe={direction => dispatch(shiftWeek(direction))}
          onDragFinish={() => (lastDragEndRef.current = performance.now())}
          className="grid grid-cols-7 w-full">
          {generateWeekDates(weekStart).map(date => (
            <Day key={date} date={date} />
          ))}
        </SwipeSlide>
      </div>
    </div>
  );
};

export default WeekStrip;
