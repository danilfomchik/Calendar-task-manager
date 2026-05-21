import Divider from '@/components/ui/Divider';
import {useCalendarContext} from '@/hooks/useCalendarContext';

import MobileDateInfo from '../MobileDateInfo';
import DaysList from './DaysList';
import WeekDays from './WeekDays';

// TODO:
// 1. make height of calendar smaller
// 2. add "add event" btn on mobile

const Calendar = () => {
  const containerRef = useCalendarContext();

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full items-center overflow-x-auto max-md:pb-8 h-[calc(100vh-72px)]">
      <div className="flex flex-col w-full min-h-fit md:h-full gap-2 items-center px-3 md:px-0 pt-2 overflow-hidden">
        <WeekDays />
        <DaysList />
      </div>

      <Divider className="my-4 md:hidden" />

      <MobileDateInfo />
    </div>
  );
};

export default Calendar;
