import {useCalendarContext} from '@/context/hooks';

import DaysList from './DaysList';
import WeekDays from './WeekDays';

const Calendar = () => {
  const containerRef = useCalendarContext();

  return (
    <div ref={containerRef} className="flex flex-[4] w-full h-full items-center overflow-x-auto">
      <div className="flex flex-col w-full h-full gap-5 items-center px-0 pt-[30px] pb-[20px] overflow-x-hidden">
        <WeekDays />
        <DaysList />
      </div>
    </div>
  );
};

export default Calendar;
