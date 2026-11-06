import {useSelector} from 'react-redux';

import SwipeSlide from '@/components/common/SwipeSlide';
import {shiftWeek} from '@/redux/date/dateSlice';
import {selectFullDate, selectWeekStart} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {generateWeekDates, getWeekPositionInMonth} from '@/services/dateUtils';

import Day from '../../Day';

const WeekStrip = () => {
  const dispatch = useAppDispatch();

  const fullDate = useSelector(selectFullDate);
  const weekStart = useSelector(selectWeekStart);

  const weekPosition = getWeekPositionInMonth(fullDate, weekStart);

  return (
    <div className="flex flex-col w-full gap-1 overflow-hidden touch-pan-y">
      <SwipeSlide
        slideKey={weekStart}
        onSwipe={direction => dispatch(shiftWeek(direction))}
        className="grid grid-cols-7 w-full">
        {generateWeekDates(weekStart).map(date => (
          <Day key={date} date={date} />
        ))}
      </SwipeSlide>

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
