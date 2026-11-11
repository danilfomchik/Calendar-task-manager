import {useSelector} from 'react-redux';

import SidebarToggle from '@/components/common/SidebarToggle';
import {selectIsSidebarOpen} from '@/redux/sidebar/selectors';
import {cx} from '@/services/utils';

import {getWeekNumber} from '../../helpers';
import WeekStrip from '../WeekStrip';
import AddEventDayButton from './AddEventDayButton';
import BackToMonth from './BackToMonth';

// Day page masthead: controls row (as Home's header) above the Week strip, which is the hero
const Masthead = ({date}: {date: string}) => {
  const isSidebarOpen = useSelector(selectIsSidebarOpen);

  return (
    <header className="shrink-0">
      <div
        className={cx('flex h-16 items-center gap-3 border-b border-line px-3 md:h-22 md:gap-0 md:px-6', {
          'md:gap-5': !isSidebarOpen,
        })}>
        <SidebarToggle className={cx({'md:hidden': isSidebarOpen})} />

        <div className="flex flex-1 items-center gap-4">
          <BackToMonth date={date} />

          <span className="ml-auto font-mono text-[11px] tracking-wider text-text-faint uppercase md:hidden">
            Week {getWeekNumber(date)}
          </span>

          <div className="ml-auto max-md:hidden">
            <AddEventDayButton date={date} />
          </div>
        </div>
      </div>

      <WeekStrip date={date} />
    </header>
  );
};

export default Masthead;
