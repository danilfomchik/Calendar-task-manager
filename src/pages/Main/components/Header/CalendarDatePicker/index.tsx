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

  // TODO: investigate how to position Dropdown with left-1/2 -translate-x-1/2 because now it is overflowing by aside (fixed)
  return (
    <div className="flex items-center relative">
      <Dropdown
        selectedOption={`${month} ${year}`}
        options={[]}
        placeholder="Pick month"
        className="left-0 max-md:fixed max-md:left-3 max-md:right-3 w-auto md:w-[max(100%,300px)] max-h-none mt-3 rounded-none border-line-strong bg-surface-raised shadow-2xl"
        wrapperClassName="font-display font-extrabold tracking-tight text-2xl md:text-[44px] static"
        triggerClassName="bg-transparent border-none p-0 max-md:min-h-11 [&_div]:font-extrabold">
        <div className="p-4 md:p-5">
          <div className="flex items-center justify-between mb-4 border border-line-strong bg-surface-overlay p-1">
            <Button
              startIcon={<ArrowLeft size="size-4" />}
              aria-label="Previous year"
              className="size-11 md:size-8 p-0 rounded-none border-none bg-transparent text-text-muted hover:bg-surface-raised hover:text-text"
              onClick={() => handleYearSwitch('prev')}
            />
            <p className="flex flex-1 items-center justify-center text-center font-mono text-sm tracking-wider text-text">
              {year}
            </p>
            <Button
              endIcon={<ArrowRight size="size-4" />}
              aria-label="Next year"
              className="size-11 md:size-8 p-0 rounded-none border-none bg-transparent text-text-muted hover:bg-surface-raised hover:text-text"
              onClick={() => handleYearSwitch('next')}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {monthsOptions.map(option => {
              const isCurrentMonth = month === option;

              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isCurrentMonth}
                  onClick={() => onMonthChange(option)}
                  className={cx(
                    'min-h-11 cursor-pointer border border-line-strong bg-surface-overlay px-2.5 py-3 text-center font-mono text-xs uppercase tracking-wider text-text transition-colors duration-150 hover:border-text-muted md:min-h-0 md:py-2.5',
                    {
                      'border-action text-action': isCurrentMonth,
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
