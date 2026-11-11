import moment from 'moment';

import SwipeSlide from '@/components/common/SwipeSlide';
import {TDirection} from '@/services/dateUtils';

import {getTodayKey, getWeekDates, getWeekNumber, shiftDay} from '../../helpers';
import DayCell from './DayCell';
import StepLink from './StepLink';
import ViewedDayCell from './ViewedDayCell';

type TWeekStripProps = {
  date: string;
  // weeks away from the Viewed day's week (mobile swipe); 0 on desktop
  weekOffset?: number;
  // given on mobile only: the strip swipes by a week and has no step chevrons
  onSwipe?: (direction: TDirection) => void;
};

// The Viewed day's week, Monday to Sunday. Derived from the date (plus the swipe offset), so navigating to a day in
// another week re-centres the strip on that week. The Viewed day only renders expanded when it is in the shown week.
const WeekStrip = ({date, weekOffset = 0, onSwipe}: TWeekStripProps) => {
  const today = getTodayKey();
  const shownDate = shiftDay(date, weekOffset * 7);
  const weekDates = getWeekDates(shownDate);

  const days = (
    <ol className="flex min-w-0 flex-1">
      {weekDates.map((day, i) => {
        if (day === date) {
          return <ViewedDayCell key={day} date={day} isToday={day === today} />;
        }

        return (
          <DayCell
            key={day}
            date={day}
            offset={moment(day).diff(moment(date), 'day')}
            isToday={day === today}
            isPast={day < today}
            withDivider={i > 0 && weekDates[i - 1] !== date}
          />
        );
      })}
    </ol>
  );

  return (
    <nav aria-label={`Week ${getWeekNumber(shownDate)}`} className="flex h-24 border-b border-line md:h-28">
      <StepLink side="prev" date={shiftDay(date, -1)} />

      {onSwipe ? (
        // touch-pan-y: horizontal drags go to the swipe, vertical ones still scroll the page
        <div className="flex min-w-0 flex-1 touch-pan-y overflow-hidden">
          <SwipeSlide slideKey={weekDates[0]} onSwipe={onSwipe} className="flex min-w-0 flex-1">
            {days}
          </SwipeSlide>
        </div>
      ) : (
        days
      )}

      <StepLink side="next" date={shiftDay(date, 1)} />
    </nav>
  );
};

export default WeekStrip;
