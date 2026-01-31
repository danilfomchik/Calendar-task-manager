import {useMemo} from 'react';
import {useSelector} from 'react-redux';

import {selectEventsByDate, selectEventsById} from '@/redux/events/selectors';

import EventsListItem from './EventsListItem';

const EventsList = ({date}: {date: string}) => {
  const eventsByDate = useSelector(selectEventsByDate(date));
  const eventsById = useSelector(selectEventsById);

  const events = useMemo(() => eventsByDate?.map(eventDate => eventsById[eventDate]), [eventsByDate, eventsById]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto scroll-smooth">
      {!events?.length ? (
        <p>no events</p>
      ) : (
        <div className="flex flex-col gap-4 pr-3">
          {events?.map(event => <EventsListItem event={event} key={event.id} />)}
        </div>
      )}
    </div>
  );
};

export default EventsList;
