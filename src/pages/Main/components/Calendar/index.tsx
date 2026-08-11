import Divider from '@/components/ui/Divider';

import MobileDateInfo from '../MobileDateInfo';
import DaysList from './DaysList';
import WeekDays from './WeekDays';

const Calendar = () => {
  return (
    <div className="flex flex-col w-full items-center overflow-x-auto max-md:pb-5 h-[calc(100vh-var(--header-height))]">
      <div className="flex flex-col w-full min-h-fit md:h-full gap-2 items-center px-3 md:px-0 pt-2 overflow-hidden">
        <WeekDays />
        <DaysList />
      </div>

      <Divider className="mb-4 md:hidden" />

      <MobileDateInfo />
    </div>
  );
};

export default Calendar;
