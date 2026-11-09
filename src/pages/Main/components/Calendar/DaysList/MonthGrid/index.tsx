import {useSelector} from 'react-redux';

import SwipeSlide from '@/components/common/SwipeSlide';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {shiftMonth} from '@/redux/date/dateSlice';
import {selectFullDate, selectMonth, selectYear} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {generateDatesArray} from '@/services/dateUtils';

import Day from '../../Day';

const GRID_CLASS = 'grid grid-rows-6 grid-cols-7 w-full min-h-71.5 h-full md:border-l border-line';

const MonthGrid = () => {
  const dispatch = useAppDispatch();

  const year = useSelector(selectYear);
  const month = useSelector(selectMonth);
  const fullDate = useSelector(selectFullDate);
  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

  const days = generateDatesArray(year as string, month as string).map(date => <Day key={date} date={date} />);

  // Month swipe is mobile-only; desktop keeps the plain grid
  if (!isMobileScreen) {
    return <div className={GRID_CLASS}>{days}</div>;
  }

  return (
    <div className="w-full min-h-0 flex-1 overflow-hidden touch-pan-y">
      <SwipeSlide
        slideKey={fullDate.slice(0, 7)}
        onSwipe={direction => dispatch(shiftMonth(direction))}
        className={GRID_CLASS}>
        {days}
      </SwipeSlide>
    </div>
  );
};

export default MonthGrid;
