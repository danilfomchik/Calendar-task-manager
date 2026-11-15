import moment from 'moment';
import {useMemo} from 'react';

import EventsTotal from '@/components/common/EventsTotal';
import {useEventsList} from '@/hooks/useEventsList';
import {countEventsByCalendar} from '@/redux/myCalendars/helpers';
import {defaultCalendars} from '@/services/constants';
import {formatDate, formatEventsCount} from '@/services/dateUtils';
import {calendarColorStyle} from '@/services/styles';

import {TDaySummaryProps} from './types';

// Day summary: total events of the Viewed day plus one chip per calendar that has events.
// Reads every event of the day, so the Calendar filter never changes it.
const DaySummary = ({date}: TDaySummaryProps) => {
  const events = useEventsList(date);
  const total = events?.length ?? 0;

  const chips = useMemo(() => countEventsByCalendar(events, defaultCalendars), [events]);

  return (
    <section aria-label="Day summary" className="flex flex-col gap-2">
      <h1 className="truncate text-lg leading-tight font-semibold md:sr-only">
        {formatDate(moment(date), 'dddd, D MMMM')}
      </h1>

      <EventsTotal count={total} />

      {chips.length > 0 && (
        <ul aria-label="Events per calendar" className="flex flex-wrap gap-1.5">
          {chips.map(chip => (
            <li
              key={chip.name}
              title={`${chip.name}: ${formatEventsCount(chip.count)}`}
              style={calendarColorStyle(chip.color)}
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
