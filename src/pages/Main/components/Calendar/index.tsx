import {useCalendarContext} from '@/hooks/useCalendarContext';

import MobileDateInfo from '../MobileDateInfo';
import DaysList from './DaysList';
import WeekDays from './WeekDays';

const Calendar = () => {
  const containerRef = useCalendarContext();

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full items-center overflow-x-auto max-md:pb-8 h-[calc(100vh-72px)]">
      <div className="flex flex-col w-full min-h-fit md:h-full gap-5 items-center px-0 pt-[30px] max-md:pt-[10px] pb-[20px] max-md:pb-[15px] overflow-hidden">
        <WeekDays />
        <DaysList />
      </div>

      <MobileDateInfo />
    </div>
  );
};

export default Calendar;
