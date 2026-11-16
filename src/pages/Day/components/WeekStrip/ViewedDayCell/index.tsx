import moment from 'moment';

import CalendarMix from '@/components/common/CalendarMix';
import {useEventsList} from '@/hooks/useEventsList';

import {getDayCellLabel} from '../../../helpers';
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
        <span className="text-sm leading-none font-semibold whitespace-nowrap md:hidden">{day.format('dddd')}</span>
        <time
          dateTime={date}
          className="font-display text-[52px] leading-[0.78] font-extrabold tracking-tighter text-info md:text-7xl">
          {day.format('D')}
        </time>

        <div className="flex min-w-0 flex-col max-md:flex-row max-md:flex-wrap max-md:items-baseline max-md:gap-x-1.5">
          {isToday && (
            <span className="font-mono text-[10px] font-medium tracking-wider text-info uppercase md:hidden">
              Today
            </span>
          )}
          <span className="truncate text-xl leading-tight font-semibold max-md:hidden">{day.format('dddd')}</span>
          <span className="truncate text-sm text-text-muted md:hidden">{day.format('MMM YYYY')}</span>
          <span className="truncate text-sm text-text-muted max-md:hidden">{day.format('MMMM YYYY')}</span>
        </div>

        {isToday && (
          <span className="ml-auto self-start font-mono text-xs font-medium tracking-wider text-info uppercase max-md:hidden">
            Today
          </span>
        )}
      </div>

      <CalendarMix date={date} tall className="max-md:hidden" />
    </div>
  );
};

export default ViewedDayCell;
