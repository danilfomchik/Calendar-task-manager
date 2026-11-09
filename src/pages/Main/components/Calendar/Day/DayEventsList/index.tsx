import {useLayoutEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import {isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars} from '@/redux/myCalendars/selectors';

import {useAgendaPanel} from '../../../../AgendaPanelContext';
import Event from './Event';
import {TDayEventsListProps} from './types';

const EVENT_HEIGHT = 20;
const EVENT_GAP = 2;

const DayEventsList = ({events, date}: TDayEventsListProps) => {
  const {openFor} = useAgendaPanel();
  const activeCalendars = useSelector(selectActiveCalendars);
  const eventsCount = events.length;

  const [slots, setSlots] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () =>
      setSlots(Math.max(0, Math.floor((container.clientHeight + EVENT_GAP) / (EVENT_HEIGHT + EVENT_GAP))));

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // a slot is reserved for "N more" only when events really overflow
  const hasOverflow = eventsCount > slots;
  const visibleEventsCount = hasOverflow ? Math.max(slots - 1, 0) : eventsCount;
  const hiddenEventsCount = eventsCount - visibleEventsCount;

  return (
    <div
      ref={containerRef}
      className="flex flex-col relative w-full flex-1 min-h-(--event-height) overflow-hidden gap-0.5"
      style={{'--event-height': `${EVENT_HEIGHT}px`} as React.CSSProperties}>
      {events.slice(0, visibleEventsCount).map(event => (
        <Event key={event.id} event={event} isDisabled={isEventDimmed(activeCalendars, event.eventCalendar)} />
      ))}

      {hasOverflow && (
        <Button
          title="Show all events for this day"
          onClick={e => {
            e.stopPropagation();
            openFor(date);
          }}
          className="w-full h-(--event-height) shrink-0 justify-start! text-[11px] leading-none font-mono text-text-muted hover:text-text p-0 pl-2 bg-transparent border-none rounded-none"
          text={`${hiddenEventsCount} more`}
        />
      )}
    </div>
  );
};

export default DayEventsList;
