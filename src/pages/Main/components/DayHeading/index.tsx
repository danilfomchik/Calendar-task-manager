import moment from 'moment';
import {Link} from 'react-router';

import {getDayPath, getTodayKey} from '@/services/dateUtils';
import {stopPropagation} from '@/services/dom';
import {cx} from '@/services/utils';

import NotInViewCue from './NotInViewCue';
import {DAY_HEADING_CLASSES} from './constants';
import {TDayHeadingProps} from './types';

// The selected day's date block in the Agenda panel and Bottom sheet, as in the Day page's Viewed day cell: the
// day numeral beside the weekday (plus "Today") over "Month YYYY", then the row's own control. Today is blue. When
// the selected day is off the Month grid, a "Not in view" line with a Go to chip sits under the month (within the
// numeral's height, so the row never grows); in the sheet it shrinks to the chip alone on the month line.
// The numeral is a link to the day's page. The block is the panel's / sheet's h2, read as one full date ("Monday 23
// November 2026, today") instead of its scattered visual pieces.
const DayHeading = ({date, size, children}: TDayHeadingProps) => {
  const day = moment(date);
  const isToday = date === getTodayKey();
  const classes = DAY_HEADING_CLASSES[size];
  // the sheet's 60px numeral is shorter than three lines of text, so its cue joins the month line
  const isCueInline = size === 'sheet';

  return (
    <div className={cx('flex items-end', classes.row)}>
      <h2 className="sr-only">
        {day.format('dddd D MMMM YYYY')}
        {isToday && ', today'}
      </h2>

      <Link
        to={getDayPath(date)}
        aria-label={`Open day, ${day.format('dddd D MMMM')}`}
        title="Open day"
        // the Bottom sheet's date row is a drag area; pressing the numeral follows the link and never moves the sheet
        onPointerDown={stopPropagation}
        className={cx(
          'relative z-20 font-headline transition-colors hover:text-action focus-visible:text-action',
          classes.numeral,
          isToday ? 'text-info' : 'text-text',
        )}>
        {day.format('D')}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <span aria-hidden className={cx('flex items-baseline', classes.weekdayRow)}>
          <span className={cx('truncate', classes.weekday)}>{day.format('dddd')}</span>
          {isToday && <span className={cx('text-info', classes.today)}>Today</span>}
        </span>
        <span className={cx('group/month flex min-w-0 items-baseline gap-1.5 text-text-muted', classes.month)}>
          <span aria-hidden className={cx('truncate', isCueInline && '@max-sm:group-has-[button]/month:hidden')}>
            {day.format('MMMM YYYY')}
          </span>
          {/* in the sheet's row under 24rem (a 320 to 390px phone) the Go to chip would cut a long month short
              ("November 2…"), so while the cue shows the month steps down to its short form */}
          {isCueInline && (
            <span aria-hidden className="hidden truncate @max-sm:group-has-[button]/month:inline">
              {day.format('MMM YYYY')}
            </span>
          )}
          {isCueInline && <NotInViewCue date={date} isInline />}
        </span>
        {!isCueInline && <NotInViewCue date={date} />}
      </div>

      {children}
    </div>
  );
};

export default DayHeading;
