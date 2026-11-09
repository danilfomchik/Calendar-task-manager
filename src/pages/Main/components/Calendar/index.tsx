import {useMediaQuery} from '@/hooks/useMediaQuery';

import BottomSheet from '../BottomSheet';
import {SHEET_PEEK} from '../BottomSheet/constants';
import DaysList from './DaysList';
import WeekDays from './WeekDays';

const Calendar = () => {
  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

  return (
    <div className="relative flex flex-col w-full items-center overflow-x-auto h-[calc(100vh-var(--height-header))]">
      <div
        className="flex flex-col w-full md:h-full gap-2 items-center md:px-0 pt-2 overflow-hidden max-md:px-3 max-md:flex-1 max-md:min-h-0"
        style={isMobileScreen ? {paddingBottom: SHEET_PEEK} : undefined}>
        <WeekDays />
        <DaysList />
      </div>

      {isMobileScreen && <BottomSheet />}
    </div>
  );
};

export default Calendar;
