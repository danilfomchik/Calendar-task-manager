import classNames from 'classnames';
import {useLayoutEffect, useRef, useState} from 'react';

import {useEventsList} from '@/hooks/useEventsList';

import EventsListItem from './EventsListItem';

const EventsList = ({
  date,
  showItemControls = false,
  showEventsCount = false,
}: {
  date: string;
  showItemControls?: boolean;
  showEventsCount?: boolean;
}) => {
  const [hasScroll, setHasScroll] = useState(false);

  const events = useEventsList(date);
  const eventsContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = eventsContainerRef.current;
    if (!container) return;

    const handleResize = () => {
      setHasScroll(prev => {
        const next = container.scrollHeight > container.clientHeight;
        return next === prev ? prev : next;
      });
    };

    handleResize();

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    return () => observer.disconnect();
  }, [events]);

  return (
    <>
      {showEventsCount && <p className="text-sm text-[#444444] uppercase mb-2.5">Events · {events?.length}</p>}

      <div
        ref={eventsContainerRef}
        className={classNames('flex-1 overflow-y-auto scroll-smooth', {'pr-2.5': hasScroll})}>
        {/* <div className="flex-1 min-h-screen overflow-y-auto scroll-smooth"> */}
        {!events?.length ? (
          <p>no events</p>
        ) : (
          <div className="flex flex-col gap-4">
            {events?.map(event => <EventsListItem key={event.id} event={event} showItemControls={showItemControls} />)}
          </div>
        )}
      </div>
    </>
  );
};

export default EventsList;
