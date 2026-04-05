import {useEventsList} from '@/hooks/useEventsList';

import EventsListItem from './EventsListItem';

const EventsList = ({date, showItemControls = false}: {date: string; showItemControls?: boolean}) => {
  const events = useEventsList(date);

  return (
    <div className="flex-1 min-h-screen overflow-y-auto scroll-smooth">
      {!events?.length ? (
        <p>no events</p>
      ) : (
        <div className="flex flex-col gap-4">
          {events?.map(event => <EventsListItem key={event.id} event={event} showItemControls={showItemControls} />)}
        </div>
      )}
    </div>
  );
};

export default EventsList;
