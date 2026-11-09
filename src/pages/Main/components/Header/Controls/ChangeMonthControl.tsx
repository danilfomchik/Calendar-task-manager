import {useMediaQuery} from '@/hooks/useMediaQuery';
import {setFullDate, shiftMonth} from '@/redux/date/dateSlice';
import {useAppDispatch} from '@/redux/store';
import {formatDate, getDate} from '@/services/dateUtils';
import {cx} from '@/services/utils';

const CONTROL_CLASS =
  'flex cursor-pointer items-center justify-center border border-line-strong font-mono text-text-muted transition-colors hover:border-text-muted hover:text-text';

const ChangeMonthControl = () => {
  const dispatch = useAppDispatch();
  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

  const size = isMobileScreen ? 'h-11 min-w-11' : 'h-9 min-w-9';

  const onSwitchToToday = () => {
    const currentFullDate = formatDate(getDate(new Date()), 'YYYY-MM-DD');

    dispatch(setFullDate(currentFullDate));
  };

  return (
    <div className="flex items-center gap-1.5">
      {!isMobileScreen && (
        <button
          type="button"
          aria-label="Previous month"
          className={cx(CONTROL_CLASS, size)}
          onClick={() => dispatch(shiftMonth(-1))}>
          ‹
        </button>
      )}
      <button
        type="button"
        className={cx(CONTROL_CLASS, size, 'px-2 text-[11px] uppercase tracking-wider md:px-3 md:text-xs')}
        onClick={onSwitchToToday}>
        Today
      </button>
      {!isMobileScreen && (
        <button
          type="button"
          aria-label="Next month"
          className={cx(CONTROL_CLASS, size)}
          onClick={() => dispatch(shiftMonth(1))}>
          ›
        </button>
      )}
    </div>
  );
};

export default ChangeMonthControl;
