import {useIsCollapsedCalendar} from '@/hooks/useIsCollapsedCalendar';

import MonthGrid from './MonthGrid';
import WeekStrip from './WeekStrip';

const DaysList = () => {
  const isCollapsedCalendar = useIsCollapsedCalendar();

  return isCollapsedCalendar ? <WeekStrip /> : <MonthGrid />;
};

export default DaysList;
