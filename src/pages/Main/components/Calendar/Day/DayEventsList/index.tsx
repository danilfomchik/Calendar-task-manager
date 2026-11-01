import {useCallback, useEffect, useRef, useState} from 'react';

import Button from '@/components/common/Button';
import {cx} from '@/services/utils';

import Event from './Event';
import {TDayEventsListProps} from './types';

const EVENT_HEIGHT = 24;

const DayEventsList = ({events, date}: TDayEventsListProps) => {
  const eventsCount = events.length;

  const [visibleEventsCount, setVisibleEventsCount] = useState(eventsCount);
  const [hiddenEventsCount, setHiddenEventsCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  const onCalcEventsVisibility = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerHeight = container.getBoundingClientRect().height;

    // calculate how many events can fit in the container height of the day cell, considering the height of each event and the gap between them
    // 4 - gap between events
    const visibleEventsCount = Math.floor((containerHeight - EVENT_HEIGHT) / (EVENT_HEIGHT + 4));

    setVisibleEventsCount(visibleEventsCount);
    setHiddenEventsCount(Math.max(eventsCount - visibleEventsCount, 0));
  }, [eventsCount]);

  useEffect(() => {
    onCalcEventsVisibility();

    const handleResize = () => {
      if (requestRef.current) return;

      requestRef.current = requestAnimationFrame(() => {
        onCalcEventsVisibility();
        requestRef.current = null;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [onCalcEventsVisibility]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-start justify-between relative w-full flex-1 overflow-y-auto max-md:scrollbar-none"
      style={{'--event-height': `${EVENT_HEIGHT}px`} as React.CSSProperties}>
      <div className={cx('w-full flex md:flex-col gap-1 max-md:gap-1.5 h-auto min-h-1.5')}>
        {events.slice(0, visibleEventsCount).map(event => (
          <Event key={event.id} event={event} isDisabled={event.isDisabled} />
        ))}

        {hiddenEventsCount > 0 && (
          <Button
            title="Open day page"
            kind="link"
            to={`/day/${date}`}
            className="max-md:hidden w-full md:h-(--event-height) relative flex items-center gap-3 text-xs overflow-hidden hover:bg-sky-500/15 md:p-1 rounded-lg cursor-pointer"
            text={`${hiddenEventsCount} more`}
          />
        )}
      </div>
    </div>
  );
};

export default DayEventsList;
