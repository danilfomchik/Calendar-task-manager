import moment from 'moment';
import {useMemo} from 'react';

import {useEventsList} from '@/hooks/useEventsList';
import {defaultCalendars} from '@/services/constants';
import {formatDate} from '@/services/dateUtils';
import {formatEventsCount} from '@/services/dateUtils';
import {calendarColorStyle} from '@/services/styles';

import {TDaySummaryProps} from './types';

// Day summary: total events of the Viewed day plus one chip per calendar that has events.
// Reads every event of the day, so the Calendar filter never changes it.
const DaySummary = ({date}: TDaySummaryProps) => {
  const events = useEventsList(date);
  const total = events?.length ?? 0;

  const chips = useMemo(
    () =>
      defaultCalendars
        .map(calendar => ({
          ...calendar,
          count: events?.filter(event => event.eventCalendar === calendar.name).length ?? 0,
        }))
        .filter(calendar => calendar.count > 0),
    [events],
  );

  return (
    <section aria-label="Day summary" className="flex flex-col gap-2">
      <h1 className="truncate text-lg leading-tight font-semibold md:sr-only">
        {formatDate(moment(date), 'dddd, D MMMM')}
      </h1>

      <p className="font-display text-2xl font-extrabold">
        {total}{' '}
        <span className="font-mono text-xs font-normal tracking-widest text-text-faint uppercase">
          {total === 1 ? 'event' : 'events'}
        </span>
      </p>

      {chips.length > 0 && (
        <ul aria-label="Events per calendar" className="flex flex-wrap gap-1.5">
          {chips.map(chip => (
            <li
              key={chip.name}
              title={`${chip.name}: ${formatEventsCount(chip.count)}`}
              style={calendarColorStyle(chip.itemColor)}
              className="flex items-center gap-1.5 border border-line px-2 py-0.5 font-mono text-[11px] text-text-muted">
              <span aria-hidden className="size-2 rounded-full bg-(--calendar-color)" />
              <span className="uppercase">{chip.name}</span>
              {chip.count}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default DaySummary;
