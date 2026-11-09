import {getCalendarColor} from '@/services/calendars';
import {cx} from '@/services/utils';

import {TEventProps} from './types';

// decorative marker: the day cell is the tap target. A Dimmed event is a hollow dot (shape, not only colour)
const DottedEventsListItem = ({event, isDisabled}: TEventProps) => {
  const calendarColor = getCalendarColor(event.eventCalendar);

  return (
    <span
      aria-hidden
      className={cx('block size-1.5 shrink-0 rounded-full border border-(--calendar-color)', {
        'bg-(--calendar-color)': !isDisabled,
        'bg-transparent': isDisabled,
      })}
      style={{'--calendar-color': calendarColor} as React.CSSProperties}
    />
  );
};

export default DottedEventsListItem;
