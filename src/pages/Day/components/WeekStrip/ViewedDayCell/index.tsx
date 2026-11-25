import moment from 'moment';

import CalendarMix from '@/components/common/CalendarMix';
import {useEventsList} from '@/hooks/useEventsList';
import {getDayCellLabel} from '@/services/dateUtils';

import {TViewedDayCellProps} from './types';

// The Viewed day, expanded in place: display numeral, weekday, "Month YYYY, week N" and a Today label
const ViewedDayCell = ({date, isToday}: TViewedDayCellProps) => {
  const count = useEventsList(date)?.length ?? 0;
  const day = moment(date);

  return (
    <div className="animate-fade-in relative flex w-full min-w-0 flex-col justify-between gap-2 border-x border-info/60 bg-linear-to-b from-info/20 to-info/5 px-2 py-2.5 md:bg-linear-to-br md:from-info/20 md:via-info/8 md:to-transparent md:px-5 md:py-3">
      <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-info" />
      <span className="sr-only">
        {getDayCellLabel(date, count)}
        {isToday && ', today'}, viewed day
      </span>

      <div aria-hidden className="flex flex-col gap-1.5 md:flex-row md:items-end md:gap-4">
        {/* mobile: the strip is 112px high, so the weekday is set solid and the line under the numeral is one line:
            "Today" when it is today (that already says which month), otherwise "Nov 2026" */}
        <span className="text-h6 leading-none whitespace-nowrap md:hidden">{day.format('dddd')}</span>
        <time dateTime={date} className="font-headline text-numeral-s text-info md:text-numeral-l">
          {day.format('D')}
        </time>

        <div className="flex min-w-0 flex-col">
          {isToday ? (
            <span className="text-caption text-info md:hidden">Today</span>
          ) : (
            <span className="truncate text-para-s text-text-muted md:hidden">{day.format('MMM YYYY')}</span>
          )}
          <span className="truncate text-h4 max-md:hidden">{day.format('dddd')}</span>
          <span className="truncate text-para-s text-text-muted max-md:hidden">{day.format('MMMM YYYY')}</span>
        </div>

        {isToday && <span className="ml-auto self-start text-caption text-info max-md:hidden">Today</span>}
      </div>

      <CalendarMix date={date} tall className="max-md:hidden" />
    </div>
  );
};

export default ViewedDayCell;
