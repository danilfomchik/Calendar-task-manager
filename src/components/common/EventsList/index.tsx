import {useLayoutEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';

import NoEventsMessage from '@/components/ui/NoEventsMessage';
import {useEventsList} from '@/hooks/useEventsList';
import {isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars} from '@/redux/myCalendars/selectors';
import {cx} from '@/services/utils';

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
  const activeCalendars = useSelector(selectActiveCalendars);
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
        <p className="font-mono text-sm text-text-faint uppercase mb-2.5">Events · {events?.length}</p>
      )}

      <div
        ref={eventsContainerRef}
        className={cx(
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
                isDisabled={isEventDimmed(activeCalendars, event.eventCalendar)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EventsList;
