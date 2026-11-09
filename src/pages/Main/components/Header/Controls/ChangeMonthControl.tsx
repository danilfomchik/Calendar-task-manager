import Button from '@/components/common/Button';
import ArrowLeft from '@/components/ui/icons/ArrowLeft';
import ArrowRight from '@/components/ui/icons/ArrowRight';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {setFullDate, shiftMonth} from '@/redux/date/dateSlice';
import {useAppDispatch} from '@/redux/store';
import {formatDate, getDate} from '@/services/dateUtils';

const CONTROL_BUTTON_CLASS = 'bg-transparent border-none hover:text-text hover:bg-surface-overlay';
const ARROW_BUTTON_CLASS = `w-7.5 h-7.5 p-0 text-text-muted ${CONTROL_BUTTON_CLASS}`;

enum MonthDirection {
  NEXT = 'next',
  PREV = 'prev',
}

const ChangeMonthControl = () => {
  const dispatch = useAppDispatch();
  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

  const onChangeMonth = (type: MonthDirection) => {
    dispatch(shiftMonth(type === MonthDirection.NEXT ? 1 : -1));
  };

  const onSwitchToToday = () => {
    const currentFullDate = formatDate(getDate(new Date()), 'YYYY-MM-DD');

    dispatch(setFullDate(currentFullDate));
  };

  return (
    <div className="flex items-center gap-0.5 border border-line p-0.75">
      {!isMobileScreen && (
        <Button
          startIcon={<ArrowLeft size="size-4" />}
          className={ARROW_BUTTON_CLASS}
          onClick={() => onChangeMonth(MonthDirection.PREV)}
        />
      )}
      <Button
        text="today"
        className={`h-full max-md:h-11 max-md:min-w-11 px-3 capitalize font-mono text-sm text-text-muted ${CONTROL_BUTTON_CLASS}`}
        onClick={onSwitchToToday}
      />
      {!isMobileScreen && (
        <Button
          endIcon={<ArrowRight size="size-4" />}
          className={ARROW_BUTTON_CLASS}
          onClick={() => onChangeMonth(MonthDirection.NEXT)}
        />
      )}
    </div>
  );
};

export default ChangeMonthControl;
