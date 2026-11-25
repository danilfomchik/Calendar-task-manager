import {useMemo} from 'react';
import {useSelector} from 'react-redux';

import {selectAllEventsByDate, selectEventsById} from '@/redux/events/selectors';
import {TEvent} from '@/redux/events/types';

// The first event after `date` (that date itself excluded), with no limit on how far ahead, or null when nothing comes
// after it. Takes the day's first event as stored. Reads all events, so the Calendar filter has no effect, as with the
// Day page's Upcoming block.
export const useNextEvent = (date: string): TEvent | null => {
  const eventsByDate = useSelector(selectAllEventsByDate);
  const eventsById = useSelector(selectEventsById);

  return useMemo(() => {
    // YYYY-MM-DD keys sort as dates
    const nextDate = Object.keys(eventsByDate)
      .filter(day => day > date && eventsByDate[day]?.some(id => eventsById[id]))
      .sort()[0];

    if (!nextDate) return null;

    const id = eventsByDate[nextDate]?.find(eventId => eventsById[eventId]);

    return id ? eventsById[id] : null;
  }, [date, eventsByDate, eventsById]);
};
