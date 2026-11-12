import {useMediaQuery} from '@/hooks/useMediaQuery';

import BottomSheet from '../BottomSheet';
import {SHEET_PEEK} from '../BottomSheet/constants';
import MonthGrid from './MonthGrid';
import WeekDays from './WeekDays';

const Calendar = () => {
  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

  return (
    <div className="relative flex flex-col w-full items-center overflow-x-auto h-[calc(100svh-var(--height-home-header))]">
      <div
        className="flex flex-col w-full md:h-full items-center md:px-0 overflow-hidden max-md:flex-1 max-md:min-h-0"
        style={isMobileScreen ? {paddingBottom: SHEET_PEEK} : undefined}>
        <WeekDays />
        <MonthGrid />
      </div>

      {isMobileScreen && <BottomSheet />}
    </div>
  );
};

export default Calendar;
