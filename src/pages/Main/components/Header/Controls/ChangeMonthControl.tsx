import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import ArrowLeft from '@/components/ui/icons/ArrowLeft';
import ArrowRight from '@/components/ui/icons/ArrowRight';
import {useIsCollapsedCalendar} from '@/hooks/useIsCollapsedCalendar';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {setFullDate, shiftMonth, shiftWeek} from '@/redux/date/dateSlice';
import {selectDay} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {formatDate, getDate} from '@/services/dateUtils';

const CONTROL_BUTTON_CLASS =
  'bg-transparent border-none rounded-[7px] hover:text-white hover:bg-[rgba(91,110,242,0.18)]';
const ARROW_BUTTON_CLASS = `w-7.5 h-7.5 p-0 text-[#a9b2f7] ${CONTROL_BUTTON_CLASS}`;

enum MonthDirection {
  NEXT = 'next',
  PREV = 'prev',
}

const ChangeMonthControl = () => {
  const dispatch = useAppDispatch();
  const currentDay = useSelector(selectDay);
  const isCollapsedCalendar = useIsCollapsedCalendar();
  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

  const onChangeMonth = (type: MonthDirection) => {
    if (isCollapsedCalendar) {
      dispatch(shiftWeek(type === MonthDirection.NEXT ? 1 : -1));

      return;
    }

    dispatch(shiftMonth(type === MonthDirection.NEXT ? 1 : -1));
  };

  const onSwitchToToday = () => {
    const currentFullDate = formatDate(getDate(new Date()), 'YYYY-MM-DD');

    dispatch(setFullDate(currentFullDate));
  };

  return (
    <div className="flex items-center gap-0.5 bg-[linear-gradient(180deg,rgba(91,110,242,0.10),rgba(91,110,242,0.04))] border border-[rgba(91,110,242,0.35)] rounded-[10px] p-0.75 shadow-[0_6px_20px_-10px_rgba(91,110,242,0.35)]">
      <Button
        startIcon={<ArrowLeft size="size-4" />}
        className={ARROW_BUTTON_CLASS}
        onClick={() => onChangeMonth(MonthDirection.PREV)}
      />
      <Button
        text={isMobileScreen ? currentDay : 'today'}
        className={`h-full p-0 md:px-3 capitalize text-sm text-[#c7cdfb] ${CONTROL_BUTTON_CLASS}`}
        onClick={onSwitchToToday}
      />
      <Button
        endIcon={<ArrowRight size="size-4" />}
        className={ARROW_BUTTON_CLASS}
        onClick={() => onChangeMonth(MonthDirection.NEXT)}
      />
    </div>
  );
};

export default ChangeMonthControl;
