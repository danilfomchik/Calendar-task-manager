import {Suspense, lazy} from 'react';

import {useMediaQuery} from '@/hooks/useMediaQuery';
import {useSheetPeek} from '@/pages/Main/components/BottomSheet/useSheetPeek';

import MonthGrid from './MonthGrid';
import WeekDays from './WeekDays';

// mobile-only, and it brings the `motion` library (the sheet's drag), so desktop never loads either; on mobile the
// space it collapses into is reserved below, so it fills that space when it arrives without moving the grid
const BottomSheet = lazy(() => import('@/pages/Main/components/BottomSheet'));

const Calendar = () => {
  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});
  const sheetPeek = useSheetPeek(isMobileScreen);

  return (
    <div className="relative flex flex-col w-full items-center overflow-x-auto h-[calc(100svh-var(--height-home-header))]">
      <div
        className="flex flex-col w-full md:h-full items-center md:px-0 overflow-hidden max-md:flex-1 max-md:min-h-0"
        style={isMobileScreen ? {paddingBottom: sheetPeek} : undefined}>
        <WeekDays />
        <MonthGrid />
      </div>

      {isMobileScreen && (
        <Suspense fallback={null}>
          <BottomSheet peek={sheetPeek} />
        </Suspense>
      )}
    </div>
  );
};

export default Calendar;
