import {PanInfo, motion} from 'framer-motion';
import {useRef} from 'react';
import {useSelector} from 'react-redux';

import {shiftWeek} from '@/redux/date/dateSlice';
import {selectFullDate, selectWeekStart} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {TWeekDirection, generateWeekDates, getWeekPositionInMonth} from '@/services/dateUtils';

import Day from '../../Day';

const SWIPE_DISTANCE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 500;
const SLIDE_OFFSET = 40;

const WeekStrip = () => {
  const dispatch = useAppDispatch();

  const fullDate = useSelector(selectFullDate);
  const weekStart = useSelector(selectWeekStart);

  // 1 - next week (slides in from the right), -1 - previous week (slides in from the left)
  const swipeDirectionRef = useRef<TWeekDirection>(1);
  const prevWeekStartRef = useRef(weekStart);

  // derive direction from the week change itself, so header arrows and swipes animate the same way
  if (prevWeekStartRef.current !== weekStart) {
    swipeDirectionRef.current = weekStart > prevWeekStartRef.current ? 1 : -1;
    prevWeekStartRef.current = weekStart;
  }

  const swipeDirection = swipeDirectionRef.current;

  const weekPosition = getWeekPositionInMonth(fullDate, weekStart);

  const handleWeekSwipe = (_: PointerEvent, {offset, velocity}: PanInfo) => {
    const isNext = offset.x < -SWIPE_DISTANCE_THRESHOLD || velocity.x < -SWIPE_VELOCITY_THRESHOLD;
    const isPrev = offset.x > SWIPE_DISTANCE_THRESHOLD || velocity.x > SWIPE_VELOCITY_THRESHOLD;

    if (!isNext && !isPrev) return;

    dispatch(shiftWeek(isNext ? 1 : -1));
  };

  return (
    <div className="flex flex-col w-full gap-1 overflow-hidden touch-pan-y">
      <motion.div
        key={weekStart}
        drag="x"
        dragSnapToOrigin
        dragElastic={0.2}
        dragConstraints={{left: 0, right: 0}}
        onDragEnd={handleWeekSwipe}
        // no exit animation: AnimatePresence kept the dragged (exiting) week in the DOM after a right swipe
        initial={{opacity: 0, x: swipeDirection * SLIDE_OFFSET}}
        animate={{opacity: 1, x: 0}}
        transition={{duration: 0.2, ease: 'easeOut'}}
        className="grid grid-cols-7 w-full">
        {generateWeekDates(weekStart).map(date => (
          <Day key={date} date={date} />
        ))}
      </motion.div>

      <div
        role="img"
        aria-label={`Week ${weekPosition.index + 1} of ${weekPosition.total}`}
        className="relative self-center w-24 h-1 rounded-full bg-white/10">
        <span
          className="absolute inset-y-0 rounded-full bg-white/45 transition-[left] duration-200 ease-out"
          style={{
            width: `${100 / weekPosition.total}%`,
            left: `${(weekPosition.index * 100) / weekPosition.total}%`,
          }}
        />
      </div>
    </div>
  );
};

export default WeekStrip;
