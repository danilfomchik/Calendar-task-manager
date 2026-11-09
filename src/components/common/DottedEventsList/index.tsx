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

  const hasMoreEvents = events.length > MAX_EVENTS_TO_SHOW;

  return (
    <div ref={containerRef} className={cx('flex flex-col items-start relative w-full scrollbar-none', className)}>
      <div className={cx('w-full flex justify-center items-center gap-1 h-2')}>
        {events.slice(0, MAX_EVENTS_TO_SHOW).map(event => (
          <DottedEventsListItem
            key={event.id}
            event={event}
            isDisabled={isEventDimmed(activeCalendars, event.eventCalendar)}
          />
        ))}

        {hasMoreEvents && <span className="text-[10px] leading-none font-mono text-text-muted">+</span>}
      </div>
    </div>
  );
};

export default DottedEventsList;
