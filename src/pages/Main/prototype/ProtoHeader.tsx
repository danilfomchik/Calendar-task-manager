// PROTOTYPE: header with a large month title; controls demoted.
import {useSelector} from 'react-redux';

import {setFullDate, setSelectedDate, shiftMonth} from '@/redux/date/dateSlice';
import {selectSelectedDate} from '@/redux/date/selectors';
import {selectIsSidebarOpen} from '@/redux/sidebar/selectors';
import {useAppDispatch} from '@/redux/store';
import {cx} from '@/services/utils';

import CalendarDatePicker from './CalendarDatePicker';
import SidebarToggle from './SidebarToggle';
import {PrimaryButton, todayStr, useEventForm} from './shared';

const ctrl =
  'proto-mono flex cursor-pointer items-center justify-center border border-(--line-strong) text-(--text-muted) hover:border-(--text-muted) hover:text-(--text)';

const ProtoHeader = ({compact = false}: {compact?: boolean}) => {
  const dispatch = useAppDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const {create} = useEventForm();

  const goToday = () => {
    const today = todayStr();
    dispatch(setFullDate(today));
    dispatch(setSelectedDate(today));
  };

  const size = compact ? 'h-11 min-w-11' : 'h-9 min-w-9';

  return (
    <header
      className={cx('flex shrink-0 items-center gap-3 border-b border-(--line)', {
        'h-16 px-3': compact,
        'h-22 px-6': !compact,
      })}>
      <SidebarToggle className={isSidebarOpen ? 'md:hidden' : ''} />

      <CalendarDatePicker compact={compact} />

      <div className="ml-auto flex items-center gap-1.5">
        {!compact && (
          <button
            type="button"
            aria-label="Previous month"
            className={cx(ctrl, size)}
            onClick={() => dispatch(shiftMonth(-1))}>
            ‹
          </button>
        )}
        <button
          type="button"
          className={cx(ctrl, size, 'px-2 text-[11px] uppercase tracking-wider md:px-3 md:text-xs')}
          onClick={goToday}>
          Today
        </button>
        {!compact && (
          <button
            type="button"
            aria-label="Next month"
            className={cx(ctrl, size)}
            onClick={() => dispatch(shiftMonth(1))}>
            ›
          </button>
        )}

        {!compact && (
          <PrimaryButton className="ml-3 h-9" onClick={() => create(selectedDate)}>
            + Add event
          </PrimaryButton>
        )}
      </div>
    </header>
  );
};

export default ProtoHeader;
