// PROTOTYPE: show/hide sidebar button in the redesign's visual language (square, hairline border, panel glyph).
import {useSelector} from 'react-redux';

import {selectIsSidebarOpen} from '@/redux/sidebar/selectors';
import {onToggleSidebar} from '@/redux/sidebar/sidebarSlice';
import {useAppDispatch} from '@/redux/store';
import {cx} from '@/services/utils';

const SidebarToggle = ({className}: {className?: string}) => {
  const dispatch = useAppDispatch();
  const isOpen = useSelector(selectIsSidebarOpen);

  return (
    <button
      type="button"
      aria-label={isOpen ? 'Hide sidebar' : 'Show sidebar'}
      aria-expanded={isOpen}
      title={isOpen ? 'Hide sidebar' : 'Show sidebar'}
      onClick={() => dispatch(onToggleSidebar())}
      className={cx(
        'flex size-11 shrink-0 cursor-pointer items-center justify-center border border-(--line-strong) text-(--text-muted) transition-colors hover:border-(--text-muted) hover:text-(--text) md:size-9',
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

export default SidebarToggle;
