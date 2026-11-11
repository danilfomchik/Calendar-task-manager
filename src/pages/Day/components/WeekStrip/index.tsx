import moment from 'moment';

import {getTodayKey, getWeekDates, getWeekNumber, shiftDay} from '../../helpers';
import DayCell from './DayCell';
import StepLink from './StepLink';
import ViewedDayCell from './ViewedDayCell';

// The Viewed day's week, Monday to Sunday. Derived from the date alone, so navigating to a day in
// another week re-centres the strip on that week.
const WeekStrip = ({date}: {date: string}) => {
  const today = getTodayKey();
  const weekDates = getWeekDates(date);

  return (
    <nav aria-label={`Week ${getWeekNumber(date)}`} className="flex h-24 border-b border-line md:h-28">
      <StepLink side="prev" date={shiftDay(date, -1)} />

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

      <StepLink side="next" date={shiftDay(date, 1)} />
    </nav>
  );
};

export default WeekStrip;
