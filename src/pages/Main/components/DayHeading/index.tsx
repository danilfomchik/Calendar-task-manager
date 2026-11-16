import moment from 'moment';

import {getTodayKey} from '@/services/dateUtils';
import {cx} from '@/services/utils';

import {DAY_HEADING_CLASSES} from './constants';
import {TDayHeadingProps} from './types';

// The selected day's date block in the Agenda panel and Bottom sheet, as in the Day page's Viewed day cell: the
// day numeral beside the weekday (plus "Today") over "Month YYYY", then the row's own control. Today is blue.
const DayHeading = ({date, size, children}: TDayHeadingProps) => {
  const day = moment(date);
  const isToday = date === getTodayKey();
  const classes = DAY_HEADING_CLASSES[size];

  return (
    <div className={cx('flex items-end', classes.row)}>
      <span
        className={cx(
          'font-display font-extrabold tracking-[-0.04em] tabular-nums',
          classes.numeral,
          isToday ? 'text-info' : 'text-text',
        )}>
        {day.format('DD')}
      </span>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className={cx('flex items-baseline', classes.weekdayRow)}>
          <span className={cx('truncate leading-tight font-semibold', classes.weekday)}>{day.format('dddd')}</span>
          {isToday && (
            <span className={cx('font-mono font-medium tracking-wider text-info uppercase', classes.today)}>Today</span>
          )}
        </span>
        <span className={cx('truncate text-text-muted', classes.month)}>{day.format('MMMM YYYY')}</span>
      </div>

      {children}
    </div>
  );
};

export default DayHeading;
