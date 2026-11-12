import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router';

import SidebarToggle from '@/components/common/SidebarToggle';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {requestToday} from '@/redux/date/dateSlice';
import {selectIsSidebarOpen} from '@/redux/sidebar/selectors';
import {useAppDispatch} from '@/redux/store';
import {TDirection, getDayPath, getTodayKey} from '@/services/dateUtils';
import {HAIRLINE_CONTROL_CLASS} from '@/services/styles';
import {cx} from '@/services/utils';

import WeekStrip from '../WeekStrip';
import AddEventDayButton from './AddEventDayButton';
import BackToMonth from './BackToMonth';
import BackToViewedWeek from './BackToViewedWeek';

// Day page masthead: controls row (as Home's header) above the Week strip, which is the hero
const Masthead = ({date}: {date: string}) => {
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const isMobile = useMediaQuery({size: 'sm', direction: 'to'});
  // mobile Week strip swipe: weeks away from the Viewed day's week
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [offsetDate, setOffsetDate] = useState(date);

  // a new Viewed day (tapping a day, any navigation) re-centres the strip on its week
  if (offsetDate !== date) {
    setOffsetDate(date);
    setSwipeOffset(0);
  }

  const weekOffset = swipeOffset;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleToday = () => {
    setSwipeOffset(0);
    dispatch(requestToday());
    navigate(getDayPath(getTodayKey()));
  };

  const handleSwipe = (direction: TDirection) => setSwipeOffset(offset => offset + direction);

  return (
    <header className="shrink-0">
      <div
        className={cx('flex h-16 items-center gap-3 border-b border-line px-3 md:h-22 md:gap-0 md:px-6', {
          'md:gap-5': !isSidebarOpen,
        })}>
        <SidebarToggle className={cx({'md:hidden': isSidebarOpen})} />

        <div className="flex flex-1 items-center gap-3 md:gap-4">
          <BackToMonth date={date} />

          {weekOffset !== 0 && (
            <BackToViewedWeek date={date} onClick={() => setSwipeOffset(0)} className="max-md:ml-auto" />
          )}

          <div className="ml-auto flex items-center gap-3 max-md:hidden">
            <button type="button" onClick={handleToday} className={HAIRLINE_CONTROL_CLASS}>
              Today
            </button>
            <AddEventDayButton date={date} />
          </div>
        </div>
      </div>

      <WeekStrip
        date={date}
        weekOffset={weekOffset}
        onStep={handleSwipe}
        onSwipe={isMobile ? handleSwipe : undefined}
      />
    </header>
  );
};

export default Masthead;
