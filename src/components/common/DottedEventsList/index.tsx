import {useRef} from 'react';

import {cx} from '@/services/utils';

import DottedEventsListItem from './DottedEventsListItem';
import {IDottedEventsListProps} from './types';

const MAX_EVENTS_TO_SHOW = 3;

const DottedEventsList = ({events, className}: IDottedEventsListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const eventsCount = events.length;
  const hasMoreEvents = eventsCount > MAX_EVENTS_TO_SHOW;

  const eventsToShow = hasMoreEvents ? Math.min(2, MAX_EVENTS_TO_SHOW) : MAX_EVENTS_TO_SHOW;
  const hiddenEventsCount = eventsCount - eventsToShow;

  return (
    <div
      ref={containerRef}
      className={cx(
        'flex flex-col items-start justify-between relative w-full flex-1 overflow-y-auto scrollbar-none',
        className,
      )}>
      <div className={cx('w-full flex justify-center gap-1 h-auto min-h-4.25')}>
        {events.slice(0, hasMoreEvents ? Math.min(2, MAX_EVENTS_TO_SHOW) : MAX_EVENTS_TO_SHOW).map(event => (
          <DottedEventsListItem key={event.id} event={event} isDisabled={event.isDisabled} />
        ))}

        {hasMoreEvents && (
          <span className="text-[10px] font-medium rounded-lg bg-[#032042] text-[#6da7ec] py-px px-1.25">
            {hiddenEventsCount < 10 ? `+${hiddenEventsCount}` : '9+'}
          </span>
        )}
      </div>
    </div>
  );
};

export default DottedEventsList;
