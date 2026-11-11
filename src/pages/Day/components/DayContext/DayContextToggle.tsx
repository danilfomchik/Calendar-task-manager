import {cx} from '@/services/utils';

import {CONTROL_CLASS} from '../Masthead/constants';
import {useDayContext} from './DayContextState';
import {DAY_CONTEXT_DRAWER_ID} from './constants';

// Desktop masthead toggle for the Day context drawer; aria-pressed reports (and announces) its state
const DayContextToggle = ({className}: {className?: string}) => {
  const {isDrawerOpen, toggleDrawer} = useDayContext();

  return (
    <button
      type="button"
      aria-pressed={isDrawerOpen}
      aria-controls={DAY_CONTEXT_DRAWER_ID}
      title={isDrawerOpen ? 'Hide Day context' : 'Show Day context'}
      onClick={toggleDrawer}
      className={cx(
        CONTROL_CLASS,
        {'border-action text-action hover:border-action hover:text-action hover:brightness-110': isDrawerOpen},
        className,
      )}>
      <span aria-hidden>✦</span>
      Day context
    </button>
  );
};

export default DayContextToggle;
