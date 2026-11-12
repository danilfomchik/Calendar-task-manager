import moment from 'moment';

import SwipeSlide from '@/components/common/SwipeSlide';
import {TDirection} from '@/services/dateUtils';
import {getTodayKey} from '@/services/dateUtils';
import {cx} from '@/services/utils';

import {getWeekDates, getWeekNumber, shiftDay} from '../../helpers';
import DayCell from './DayCell';
import StepLink from './StepLink';
import ViewedDayCell from './ViewedDayCell';

type TWeekStripProps = {
  date: string;
  // weeks away from the Viewed day's week (mobile swipe); 0 on desktop
  weekOffset?: number;
  // chevrons (desktop) step by a week
  onStep: (direction: TDirection) => void;
  // given on mobile only: the strip also swipes by a week
  onSwipe?: (direction: TDirection) => void;
};

// The Viewed day's week, Monday to Sunday. Derived from the date (plus the swipe offset), so navigating to a day in
// another week re-centres the strip on that week. The Viewed day only renders expanded when it is in the shown week.
const WeekStrip = ({date, weekOffset = 0, onStep, onSwipe}: TWeekStripProps) => {
  const today = getTodayKey();
  const shownDate = shiftDay(date, weekOffset * 7);
  const weekDates = getWeekDates(shownDate);

  const days = (
    <ol className="flex min-w-0 flex-1">
      {weekDates.map((day, i) => {
        const isViewed = day === date;
        const withDivider = !isViewed && i > 0 && weekDates[i - 1] !== date;

        // One stable <li> per day: flex-grow transitions, so the expanded Viewed day glides between cells
        return (
          <li
            key={day}
            aria-current={isViewed ? 'date' : undefined}
            className={cx(
              'flex min-w-0 transition-[flex-grow] duration-300 ease-out',
              isViewed ? 'flex-[2.4] md:flex-[2.6]' : 'flex-1',
              withDivider && 'border-l border-line',
            )}>
            {isViewed ? (
              <ViewedDayCell date={day} isToday={day === today} />
            ) : (
              <DayCell
                date={day}
                offset={moment(day).diff(moment(date), 'day')}
                isToday={day === today}
                isPast={day < today}
              />
            )}
          </li>
        );
      })}
    </ol>
  );

  return (
    <nav aria-label={`Week ${getWeekNumber(shownDate)}`} className="flex h-28 border-b border-line">
      <StepLink side="prev" onClick={() => onStep(-1)} />

      {onSwipe ? (
        // touch-pan-y: horizontal drags go to the swipe, vertical ones still scroll the page
        <div className="flex min-w-0 flex-1 touch-pan-y overflow-hidden">
          <SwipeSlide slideKey={weekDates[0]} onSwipe={onSwipe} className="flex min-w-0 flex-1">
            {days}
          </SwipeSlide>
        </div>
      ) : (
        <div className="flex min-w-0 flex-1 overflow-hidden">
          <SwipeSlide slideKey={weekDates[0]} onSwipe={onStep} isDraggable={false} className="flex min-w-0 flex-1">
            {days}
          </SwipeSlide>
        </div>
      )}

      <StepLink side="next" onClick={() => onStep(1)} />
    </nav>
  );
};

export default WeekStrip;
