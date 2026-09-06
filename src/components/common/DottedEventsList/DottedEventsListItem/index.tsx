import {getCalendarColor} from '@/services/calendars';
import {cx} from '@/services/utils';

import {TEventProps} from './types';

const DottedEventsListItem = ({event, isDisabled}: TEventProps) => {
  const calendarColor = getCalendarColor(event.eventCalendar);

  return (
    <button
      className={cx(
        'relative flex items-center gap-3 flex-[0_0_6px]rounded-md cursor-pointer',
        'group/event overflow-hidden isolate',
        {
          'opacity-10 pointer-events-none cursor-not-allowed': isDisabled,
        },
      )}
      style={
        {
          '--calendar-color': calendarColor,
        } as React.CSSProperties
      }>
      <div className="h-1.5 w-1.5 rounded-full transition-opacity aspect-square bg-(--calendar-color)"></div>
    </button>
  );
};

export default DottedEventsListItem;
