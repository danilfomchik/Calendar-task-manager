import moment from 'moment';
import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import ArrowLeft from '@/components/ui/icons/ArrowLeft';
import ArrowRight from '@/components/ui/icons/ArrowRight';
import {setFullDate} from '@/redux/date/dateSlice';
import {selectFullDate} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {formatDate, getDate} from '@/services/dateUtils';

enum MonthDirection {
  NEXT = 'next',
  PREV = 'prev',
}

const ChangeMonthControl = () => {
  const dispatch = useAppDispatch();
  const fullDate = useSelector(selectFullDate);

  const onChangeMonth = (type: MonthDirection) => {
    let monthIndex = 0;

    if (type === MonthDirection.NEXT) {
      monthIndex = 1;
    } else {
      monthIndex = -1;
    }

    const changedDate = moment(fullDate).add(monthIndex, 'M');
    const changedFullDate = formatDate(changedDate, 'YYYY-MM-DD');

    dispatch(setFullDate(changedFullDate));
  };

  const onSwithToToday = () => {
    const currentFullDate = formatDate(getDate(new Date()), 'YYYY-MM-DD');

    dispatch(setFullDate(currentFullDate));
  };

  return (
    <div className="flex max-md:gap-1">
      <Button
        startIcon={<ArrowLeft size="size-4" />}
        className="p-[8px] rounded-lg md:rounded-none md:rounded-s-lg md:border-r-0"
        onClick={() => onChangeMonth(MonthDirection.PREV)}
      />
      <Button text="today" className="rounded-none text-sm py-[8px] px-[10px] max-md:hidden" onClick={onSwithToToday} />
      <Button
        endIcon={<ArrowRight size="size-4" />}
        className="p-[8px] rounded-lg md:rounded-none md:rounded-e-lg md:border-l-0"
        onClick={() => onChangeMonth(MonthDirection.NEXT)}
      />
    </div>
  );
};

export default ChangeMonthControl;
