import moment from 'moment';
import {useSelector} from 'react-redux';

import {selectFullDate, selectMonth, selectYear} from '@/redux/date/selectors';
import {formatDate, generateDatesArray, getDate, getWeekDays} from '@/services/dateUtils';
import {cx} from '@/services/utils';

const MonthSmallCalendar = ({className = ''}) => {
  const fullDate = useSelector(selectFullDate);
  const year = useSelector(selectYear);
  const month = useSelector(selectMonth);

  const dates = generateDatesArray(year as string, month as string);
  const weekDays = getWeekDays();

  return (
    <div className={cx('px-4 py-5', className)}>
      <p className="font-mono text-[15px] text-text-faint uppercase mb-2.5 pl-1.5">
        {month} {year}
      </p>

      <div className="grid grid-cols-7 gap-px">
        {weekDays.map(weekday => (
          <span key={weekday} className="flex flex-1 justify-center px-2 font-mono text-sm text-text-muted">
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
              className={cx('text-text-muted font-mono text-sm py-0.75 text-center', {
                'text-text-faint': currentMonth !== dateMonth,
                'text-info-ink bg-info font-bold': currentDate === date,
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
