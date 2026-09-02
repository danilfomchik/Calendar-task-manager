import {useMemo} from 'react';
import {useSelector} from 'react-redux';

import {selectEventsByDate, selectEventsById} from '@/redux/events/selectors';

export const useEventsList = (date: string) => {
  const eventsByDate = useSelector(selectEventsByDate(date));
  const eventsById = useSelector(selectEventsById);

  const events = useMemo(() => eventsByDate?.map(eventDate => eventsById[eventDate]), [eventsByDate, eventsById]);

  return events;
};
