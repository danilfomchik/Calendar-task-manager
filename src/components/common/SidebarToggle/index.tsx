import {memo} from 'react';
import {useSelector} from 'react-redux';

import {selectIsSidebarOpen} from '@/redux/sidebar/selectors';
import {onToggleSidebar} from '@/redux/sidebar/sidebarSlice';
import {useAppDispatch} from '@/redux/store';
import {cx} from '@/services/utils';

const SidebarToggle = ({className = ''}) => {
  const dispatch = useAppDispatch();
  const isOpen = useSelector(selectIsSidebarOpen);
  const label = isOpen ? 'Hide sidebar' : 'Show sidebar';

  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={isOpen}
      title={label}
      onClick={() => dispatch(onToggleSidebar())}
      className={cx(
        'flex size-11 shrink-0 cursor-pointer items-center justify-center border border-line-strong text-text-muted transition-colors hover:border-text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action md:size-9',
        className,
      )}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1.5" />
        {/* the rail is filled while the sidebar is shown */}
        <rect
          x="1.5"
          y="1.5"
          width="4"
          height="13"
          fill={isOpen ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
};

export default memo(SidebarToggle);
