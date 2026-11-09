import moment from 'moment';
import {useSelector} from 'react-redux';

import {selectFullDate, selectMonth, selectSelectedDate, selectYear} from '@/redux/date/selectors';
import {formatDate, generateDatesArray, getDate, getWeekDays} from '@/services/dateUtils';
import {cx} from '@/services/utils';

const MonthSmallCalendar = ({className = ''}) => {
  const fullDate = useSelector(selectFullDate);
  const selectedDate = useSelector(selectSelectedDate);
  const year = useSelector(selectYear);
  const month = useSelector(selectMonth);

  const dates = generateDatesArray(year as string, month as string);
  const weekDays = getWeekDays();

  return (
    <div className={cx('px-4 py-5', className)}>
      <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-text-faint">
        {month} {year}
      </p>

      <div className="grid grid-cols-7 gap-px">
        {weekDays.map(weekday => (
          <span key={weekday} className="flex justify-center pb-1 font-mono text-[11px] text-text-faint">
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
              className={cx('text-text-muted font-mono text-xs py-0.75 text-center', {
                'text-text-faint': currentMonth !== dateMonth,
                'text-info-ink bg-info font-medium': currentDate === date,
                'outline-1 -outline-offset-1 outline-action': selectedDate === date,
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
