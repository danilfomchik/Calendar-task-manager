import {useMemo} from 'react';
import {useSelector} from 'react-redux';

import {countEventsByCalendar, isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars, selectCalendarsList} from '@/redux/myCalendars/selectors';
import {cx} from '@/services/utils';

import DottedEventsListItem from './DottedEventsListItem';
import {IDottedEventsListProps} from './types';

const MAX_DOTS = 4;

// The mobile day cell's Calendar mix: one dot per calendar that has events that day, in the calendars' own order (the
// same order as the sidebar and the Calendar mix bar), so a week reads as columns of comparable marks. A `+` follows
// when more calendars than MAX_DOTS have events. Hollow for a calendar the Calendar filter leaves out.
const DottedEventsList = ({events, className}: IDottedEventsListProps) => {
  const activeCalendars = useSelector(selectActiveCalendars);
  const calendarsList = useSelector(selectCalendarsList);

  const calendars = useMemo(() => countEventsByCalendar(events, calendarsList), [events, calendarsList]);

  return (
    <div className={cx('w-full flex justify-center items-center gap-1 h-2', className)}>
      {calendars.slice(0, MAX_DOTS).map(calendar => (
        <DottedEventsListItem
          key={calendar.name}
          color={calendar.color}
          isDisabled={isEventDimmed(activeCalendars, calendar.name)}
        />
      ))}

      {calendars.length > MAX_DOTS && <span className="text-caption leading-none text-text-muted">+</span>}
    </div>
  );
};

export default DottedEventsList;
