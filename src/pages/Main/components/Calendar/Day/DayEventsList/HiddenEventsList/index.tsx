import Event from '../Event';
import {THiddenEventsListProps} from './types';

const HiddenEventsList = ({events, eventsRefs, eventsContainerRef}: THiddenEventsListProps) => {
  return (
    <div
      ref={eventsContainerRef}
      className="flex gap-[9px] w-[80%] absolute top-0 left-0 invisible opacity-0 h-0 overflow-hidden">
      {events.map((event, i) => (
        <Event
          key={event.id}
          event={event}
          eventRef={el => {
            if (el && eventsRefs.current) {
              eventsRefs.current[i] = el;
            }
          }}
          eventIndex={i}
        />
      ))}
    </div>
  );
};

export default HiddenEventsList;
