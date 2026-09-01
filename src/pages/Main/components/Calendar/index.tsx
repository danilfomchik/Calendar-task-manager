import Divider from '@/components/ui/Divider';
import {useCalendarContext} from '@/hooks/useCalendarContext';

import MobileDateInfo from '../MobileDateInfo';
import DaysList from './DaysList';
import WeekDays from './WeekDays';

const Calendar = () => {
  const containerRef = useCalendarContext();

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full items-center overflow-x-auto max-md:pb-5 h-[calc(100vh-var(--height-header))]">
      <div className="flex flex-col w-full md:h-full gap-2 items-center px-3 md:px-0 pt-2 overflow-hidden">
        <WeekDays />
        <DaysList />
      </div>

      <Divider className="mb-4 md:hidden" />

      <MobileDateInfo />
    </div>
  );
};

export default Calendar;
