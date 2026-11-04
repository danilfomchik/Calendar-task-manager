import classNames from 'classnames';
import {useLayoutEffect, useRef, useState} from 'react';

import NoEventsMessage from '@/components/ui/NoEventsMessage';
import {useEventsList} from '@/hooks/useEventsList';

import EventsListItem from './EventsListItem';

// TODO:
// 1. finalize tooltip implementation
// 2. refactor day events list (as on screenshot)
// 3. reuse hidden events logic for refactored list to show (+n events)

const EventsList = ({
  date,
  showItemControls = false,
  showEventsCount = false,
  className = '',
}: {
  date: string;
  showItemControls?: boolean;
  showEventsCount?: boolean;
  className?: string;
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
      {showEventsCount && !!events?.length && (
        <p className="text-sm text-[#444444] uppercase mb-2.5">Events · {events?.length}</p>
      )}

      <div
        ref={eventsContainerRef}
        className={classNames(
          'flex-1 overflow-y-auto scroll-smooth',
          {
            'pr-2.5': hasScroll && !!events?.length,
          },
          className,
        )}>
        {!events?.length ? (
          <NoEventsMessage />
        ) : (
          <div className="flex flex-col gap-2.5 md:gap-4">
            {events?.map(event => (
              <EventsListItem
                key={event.id}
                event={event}
                showItemControls={showItemControls}
                isDisabled={event.isDisabled}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EventsList;
