import {useState} from 'react';
import {useSelector} from 'react-redux';

import SidebarToggle from '@/components/common/SidebarToggle';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {selectIsSidebarOpen} from '@/redux/sidebar/selectors';
import {TDirection} from '@/services/dateUtils';
import {cx} from '@/services/utils';

import {getWeekNumber, shiftDay} from '../../helpers';
import DayContextToggle from '../DayContext/DayContextToggle';
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

  // desktop has no swipe, so it always shows the Viewed day's week
  const weekOffset = isMobile ? swipeOffset : 0;

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

          <div className="ml-auto flex items-center gap-3 md:hidden">
            {/* below 390px the row can't also fit "Back to {day}"; the Week strip's nav label still names the week */}
            <span
              className={cx(
                'font-mono text-[11px] tracking-wider whitespace-nowrap text-text-faint uppercase',
                weekOffset !== 0 && 'max-[389px]:hidden',
              )}>
              Week {getWeekNumber(shiftDay(date, weekOffset * 7))}
            </span>

            {weekOffset !== 0 && <BackToViewedWeek date={date} onClick={() => setSwipeOffset(0)} />}
          </div>

          <div className="ml-auto max-md:hidden">
            <DayContextToggle className="mr-3" />
            <AddEventDayButton date={date} />
          </div>
        </div>
      </div>

      <WeekStrip date={date} weekOffset={weekOffset} onSwipe={isMobile ? handleSwipe : undefined} />
    </header>
  );
};

export default Masthead;
