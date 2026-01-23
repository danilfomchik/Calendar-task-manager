import {useCallback, useEffect, useRef, useState} from 'react';

import {TEvent} from '@/redux/events/types';

import Event from './Event';
import HiddenEventsList from './HiddenEventsList';
import RemainedItems from './RemainedItems';
import {TDayEventsListProps} from './types';

const DayEventsList = ({events}: TDayEventsListProps) => {
  const [visibleEvents, setVisibleEvents] = useState<TEvent[]>([]);
  const [hiddenEvents, setHiddenEvents] = useState<TEvent[]>([]);

  const eventsContainerRef = useRef<HTMLDivElement>(null);
  const eventsRefs = useRef<HTMLDivElement[]>([]);

  const handleResize = useCallback(() => {
    if (!eventsContainerRef.current) return;

    const eventsContainerSizes = eventsContainerRef.current.getBoundingClientRect();

    const hiddenEvents: TEvent[] = [];
    const visibleEvents: TEvent[] = [];

    for (let i = 0; i < events.length; i++) {
      const eventRef = eventsRefs.current[i];
      const eventRefSizes = eventRef.getBoundingClientRect();

      const isFits =
        eventRefSizes.right < eventsContainerSizes.right && eventRefSizes.left < eventsContainerSizes.right;

      if (isFits) {
        visibleEvents.push(events[i]);
      } else {
        hiddenEvents.push(events[i]);
      }
    }

    setVisibleEvents(visibleEvents);
    setHiddenEvents(hiddenEvents);
  }, [events]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => handleResize());
    });

    if (eventsContainerRef.current) {
      observer.observe(eventsContainerRef.current);
    }

    return () => observer.disconnect();
  }, [handleResize]);

  return (
    <div className="flex items-center justify-between relative">
      <HiddenEventsList events={events} eventsContainerRef={eventsContainerRef} eventsRefs={eventsRefs} />
      <div ref={eventsContainerRef} className="w-[80%] flex gap-[9px]">
        {visibleEvents.map((event, i) => (
          <Event
            key={event.id}
            event={event}
            eventRef={el => {
              if (el) {
                eventsRefs.current[i] = el;
              }
            }}
            eventIndex={i}
          />
        ))}
      </div>

      {!!hiddenEvents.length && <RemainedItems items={hiddenEvents} />}
    </div>
  );
};

export default DayEventsList;
