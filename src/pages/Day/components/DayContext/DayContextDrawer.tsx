import {cx} from '@/services/utils';

import DayContextBlocks from './DayContextBlocks';
import {useDayContext} from './DayContextState';
import DayContextTab from './DayContextTab';
import {DAY_CONTEXT_DRAWER_ID} from './constants';
import {inertProps} from './helpers';

// Desktop right-hand drawer with its Context tab. The width animates (CSS transition, none under reduced motion);
// the inner column keeps its full width so the content slides out instead of reflowing.
const DayContextDrawer = ({date}: {date: string}) => {
  const {isDrawerOpen} = useDayContext();

  return (
    <div className="flex shrink-0">
      <DayContextTab />
      <aside
        id={DAY_CONTEXT_DRAWER_ID}
        aria-label="Day context"
        {...inertProps(!isDrawerOpen)}
        className={cx(
          'shrink-0 overflow-hidden border-action transition-[width] duration-300 ease-out motion-reduce:transition-none',
          isDrawerOpen ? 'w-80 border-l' : 'w-0',
        )}>
        <div className="h-full w-80 overflow-y-auto p-4">
          <DayContextBlocks date={date} />
        </div>
      </aside>
    </div>
  );
};

export default DayContextDrawer;
