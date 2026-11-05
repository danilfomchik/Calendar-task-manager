import {useSelector} from 'react-redux';

import {useIsCollapsedCalendar} from '@/hooks/useIsCollapsedCalendar';
import {selectMonth, selectYear} from '@/redux/date/selectors';
import {generateDatesArray} from '@/services/dateUtils';

import Day from '../Day';
import WeekStrip from './WeekStrip';

const DaysList = () => {
  const year = useSelector(selectYear);
  const month = useSelector(selectMonth);

  const isCollapsedCalendar = useIsCollapsedCalendar();

  if (isCollapsedCalendar) {
    return <WeekStrip />;
  }

  const dates = generateDatesArray(year as string, month as string);

  return (
    <div className="grid grid-rows-6 grid-cols-7 w-full min-h-71.5 h-auto md:h-full md:border-t border-secondary-background-color">
      {dates.map(date => (
        <Day key={date} date={date} />
      ))}
    </div>
  );
};

export default DaysList;
