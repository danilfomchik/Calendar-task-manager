import {cx} from '@/services/utils';

import {useDayContext} from './DayContextState';
import {DAY_CONTEXT_DRAWER_ID} from './constants';

// Desktop handle of the Day context drawer. It is the drawer's first column, so it touches the drawer's edge while
// open and stays at the right edge of the screen while the drawer is closed; aria-pressed reports (and announces) it.
const DayContextTab = () => {
  const {isDrawerOpen, toggleDrawer} = useDayContext();

  return (
    <button
      type="button"
      aria-pressed={isDrawerOpen}
      aria-controls={DAY_CONTEXT_DRAWER_ID}
      title={isDrawerOpen ? 'Hide Day context' : 'Show Day context'}
      onClick={toggleDrawer}
      className={cx(
        'flex h-32 w-9 shrink-0 cursor-pointer items-center justify-center gap-2 self-center border border-r-0 bg-surface-raised',
        'font-mono text-[11px] tracking-widest uppercase transition-colors [writing-mode:vertical-rl]',
        isDrawerOpen
          ? 'border-action text-action hover:brightness-110'
          : 'border-line-strong text-text-muted hover:border-action hover:text-action',
      )}>
      <span aria-hidden>{isDrawerOpen ? '›' : '‹'}</span>
      <span className="rotate-180">
        <span aria-hidden>✦</span> Day context
      </span>
    </button>
  );
};

export default DayContextTab;
