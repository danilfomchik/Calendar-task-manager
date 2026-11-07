import {useDragControls} from 'framer-motion';
import {useSelector} from 'react-redux';

import SwipeSlide from '@/components/common/SwipeSlide';
import {shiftWeek} from '@/redux/date/dateSlice';
import {selectWeekStart} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {WEEK_LENGTH, formatDate, generateWeekDates, getDate, shiftDate} from '@/services/dateUtils';
import {cx} from '@/services/utils';

import Day from '../../Day';

const cueClassName =
  'absolute top-1 h-8 w-10 flex items-center justify-center touch-pan-y rounded text-xs sm:text-base text-white/25 active:text-white/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70';

const WeekStrip = () => {
  const dispatch = useAppDispatch();

  const dragControls = useDragControls();

  const weekStart = useSelector(selectWeekStart);

  const prevCue = formatDate(getDate(shiftDate(weekStart, -1)), 'DD');
  const nextCue = formatDate(getDate(shiftDate(weekStart, WEEK_LENGTH)), 'DD');

  return (
    <div className="relative w-full touch-pan-y">
      <button
        type="button"
        aria-label="Previous week"
        onPointerDown={e => dragControls.start(e)}
        onClick={() => dispatch(shiftWeek(-1))}
        className={cx(cueClassName, 'right-full')}>
        {prevCue}
      </button>

      <div className="flex flex-col w-full overflow-hidden">
        <SwipeSlide
          slideKey={weekStart}
          dragControls={dragControls}
          onSwipe={direction => dispatch(shiftWeek(direction))}
          className="grid grid-cols-7 w-full">
          {generateWeekDates(weekStart).map(date => (
            <Day key={date} date={date} />
          ))}
        </SwipeSlide>
      </div>

      <button
        type="button"
        aria-label="Next week"
        onPointerDown={e => dragControls.start(e)}
        onClick={() => dispatch(shiftWeek(1))}
        className={cx(cueClassName, 'left-full')}>
        {nextCue}
      </button>
    </div>
  );
};

export default WeekStrip;
