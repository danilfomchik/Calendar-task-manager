import {useRef} from 'react';
import {useSelector} from 'react-redux';

import {isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars} from '@/redux/myCalendars/selectors';
import {cx} from '@/services/utils';

import DottedEventsListItem from './DottedEventsListItem';
import {IDottedEventsListProps} from './types';

const MAX_EVENTS_TO_SHOW = 3;

const DottedEventsList = ({events, className}: IDottedEventsListProps) => {
  const activeCalendars = useSelector(selectActiveCalendars);
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
          <DottedEventsListItem
            key={event.id}
            event={event}
            isDisabled={isEventDimmed(activeCalendars, event.eventCalendar)}
          />
        ))}

        {hasMoreEvents && (
          <span className="text-[10px] font-medium font-mono bg-surface-overlay text-text-muted py-px px-1.25">
            {hiddenEventsCount < 10 ? `+${hiddenEventsCount}` : '9+'}
          </span>
        )}
      </div>
    </div>
  );
};

export default DottedEventsList;
