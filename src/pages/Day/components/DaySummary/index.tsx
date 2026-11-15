import moment from 'moment';
import {useMemo} from 'react';

import CalendarChips from '@/components/common/CalendarChips';
import EventsTotal from '@/components/common/EventsTotal';
import {useEventsList} from '@/hooks/useEventsList';
import {defaultCalendars} from '@/services/constants';
import {formatDate} from '@/services/dateUtils';

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
          name: calendar.name,
          color: calendar.itemColor,
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

      <EventsTotal count={total} className="leading-normal" />

      {chips.length > 0 && <CalendarChips chips={chips} />}
    </section>
  );
};

export default DaySummary;
