import {TEvent} from '@/redux/events/types';

const EventsListItem = ({event}: {event: TEvent}) => {
  return (
    <div style={{border: `1px solid ${event.color}`}} className="rounded-lg px-4 py-3">
      <h4 className="text-lg font-semibold">{event.title}</h4>

      {event.description && <p className="text-base text-gray-400 line-clamp-3">{event.description}</p>}
    </div>
  );
};

export default EventsListItem;
