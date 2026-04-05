import moment from 'moment';
import {useSelector} from 'react-redux';

import {selectFullDate, selectMonth, selectYear} from '@/redux/date/selectors';
import {formatDate, generateDatesArray, getDate, getWeekDays} from '@/services/dateUtils';
import {cx} from '@/services/utils';

const MonthSmallCalendar = () => {
  const fullDate = useSelector(selectFullDate);
  const year = useSelector(selectYear);
  const month = useSelector(selectMonth);

  const dates = generateDatesArray(year as string, month as string);
  const weekDays = getWeekDays();

  return (
    <div className="px-4 py-5">
      <p className="text-[15px] text-[#444444] uppercase mb-[10px] pl-1.5">
        {month} {year}
      </p>

      <div className="grid grid-cols-7 gap-[1px]">
        {weekDays.map(weekday => (
          <span key={weekday} className="flex flex-1 justify-center px-2 text-sm text-gray-400">
            {weekday.slice(0, 1)}
          </span>
        ))}

        {dates.map(date => {
          const day = formatDate(getDate(date), 'DD');
          const currentMonth = formatDate(moment(fullDate), 'M');
          const dateMonth = formatDate(moment(date), 'M');
          const currentDate = formatDate(getDate(new Date()), 'YYYY-MM-DD');

          return (
            <div
              key={date}
              className={cx('text-gray-400 text-sm py-[3px] text-center rounded-full', {
                'text-[#444444]': currentMonth !== dateMonth,
                'text-white bg-blue-600': currentDate === date,
              })}>
              <time dateTime={date}>{day}</time>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthSmallCalendar;
