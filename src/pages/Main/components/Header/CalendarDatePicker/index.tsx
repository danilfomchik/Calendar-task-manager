import moment from 'moment';
import {useCallback, useMemo} from 'react';
import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import Dropdown from '@/components/common/inputs/Dropdown';
import ArrowLeft from '@/components/ui/icons/ArrowLeft';
import ArrowRight from '@/components/ui/icons/ArrowRight';
import {setFullDate} from '@/redux/date/dateSlice';
import {selectFullDate, selectMonth, selectYear} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {formatDate, getMonthsOptions} from '@/services/dateUtils';
import {cx} from '@/services/utils';

const CalendarDatePicker = () => {
  const dispatch = useAppDispatch();
  const currentFullDate = useSelector(selectFullDate);
  const year = useSelector(selectYear);
  const month = useSelector(selectMonth);

  const monthsOptions = useMemo(() => getMonthsOptions(), []);

  const onMonthChange = useCallback(
    (newMonth: string) => {
      const newMonthIndex = formatDate(moment(currentFullDate).month(newMonth), 'M');

      const changedDate = moment(currentFullDate).month(+newMonthIndex - 1);
      const changedFullDate = formatDate(changedDate, 'YYYY-MM-DD');

      dispatch(setFullDate(changedFullDate));
    },
    [currentFullDate, dispatch],
  );

  const onYearChange = useCallback(
    (newYear: number) => {
      const changedDate = moment(currentFullDate).year(newYear);
      const changedFullDate = formatDate(changedDate, 'YYYY-MM-DD');

      dispatch(setFullDate(changedFullDate));
    },
    [currentFullDate, dispatch],
  );

  // TODO: move type into global one
  const handleYearSwitch = (type: 'prev' | 'next') => {
    if (!year) return;

    const yearToNum = Number(year);
    const newYear = type === 'prev' ? yearToNum - 1 : yearToNum + 1;

    onYearChange(newYear);
  };

  // TODO: fix all repeated colors + change pallete colors
  // TODO: add mobile styles
  // TODO: investigate how to position Dropdown with left-1/2 -translate-x-1/2 because now it is overflowing by aside (fixed)
  return (
    <div className="flex items-center relative">
      <Dropdown
        selectedOption={`${month} ${year}`}
        options={[]}
        placeholder="Pick month"
        className="left-0 max-md:fixed max-md:left-3 max-md:right-3 w-auto md:w-[max(100%,300px)] max-h-none rounded-[10px] mt-3"
        wrapperClassName="text-base static"
        triggerClassName="bg-transparent border-none p-0">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-4 bg-[#18181d] border border-[rgba(255,255,255,0.09)] rounded-[9px] px-3.5 py-2.5">
            <Button
              startIcon={<ArrowLeft size="size-4" />}
              // TODO: move [#3b5bfd] into separate var
              className="w-6 h-6 p-0 rounded-lg outline-none border-none bg-tansparent text-[#9a9aa3] hover:bg-white/6"
              onClick={() => handleYearSwitch('prev')}
            />
            <p className="flex flex-1 items-center justify-center text-center text-base text-[#f2f2f4]">{year}</p>
            <Button
              endIcon={<ArrowRight size="size-4" />}
              className="w-6 h-6 p-0 rounded-lg outline-none border-none bg-tansparent text-[#9a9aa3] hover:bg-white/6"
              onClick={() => handleYearSwitch('next')}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {monthsOptions.map(option => {
              const isCurrentMonth = month === option;

              return (
                <button
                  type="button"
                  onClick={() => onMonthChange(option)}
                  className={cx(
                    'rounded-[9px] text-sm text-center cursor-pointer outline outline-white/9 transition-all bg-[#18181d] hover:bg-[rgba(109,124,247,0.12)] text-[#f2f2f4] py-2.5 px-2.5',
                    {
                      'outline-[#3b5bfd] text-[#3b5bfd] bg-[rgba(109,124,247,0.12)]': isCurrentMonth,
                    },
                  )}>
                  {option.substring(0, 3)}
                </button>
              );
            })}
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

export default CalendarDatePicker;
