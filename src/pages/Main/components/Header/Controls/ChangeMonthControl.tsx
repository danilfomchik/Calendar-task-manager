import {requestToday, setFullDate, shiftMonth} from '@/redux/date/dateSlice';
import {useAppDispatch} from '@/redux/store';
import {formatDate, getDate} from '@/services/dateUtils';
import {cx} from '@/services/utils';

const SIZE_CLASS = 'h-11 min-w-11 md:h-9 md:min-w-9';
const CONTROL_CLASS =
  'cursor-pointer items-center justify-center border border-line-strong font-mono text-text-muted transition-colors hover:border-text-muted hover:text-text';

const ChangeMonthControl = () => {
  const dispatch = useAppDispatch();

  const onSwitchToToday = () => {
    const currentFullDate = formatDate(getDate(new Date()), 'YYYY-MM-DD');

    dispatch(setFullDate(currentFullDate));
    dispatch(requestToday());
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="Previous month"
        className={cx(CONTROL_CLASS, SIZE_CLASS, 'hidden md:flex')}
        onClick={() => dispatch(shiftMonth(-1))}>
        ‹
      </button>
      <button
        type="button"
        className={cx(CONTROL_CLASS, SIZE_CLASS, 'flex px-2 text-[11px] uppercase tracking-wider md:px-3 md:text-xs')}
        onClick={onSwitchToToday}>
        Today
      </button>
      <button
        type="button"
        aria-label="Next month"
        className={cx(CONTROL_CLASS, SIZE_CLASS, 'hidden md:flex')}
        onClick={() => dispatch(shiftMonth(1))}>
        ›
      </button>
    </div>
  );
};

export default ChangeMonthControl;
