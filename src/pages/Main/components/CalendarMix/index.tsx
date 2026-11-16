import {useMemo} from 'react';
import {useSelector} from 'react-redux';

import {useEventsList} from '@/hooks/useEventsList';
import {countEventsByCalendar, isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars, selectCalendarsList} from '@/redux/myCalendars/selectors';
import {calendarColorStyle} from '@/services/styles';
import {cx} from '@/services/utils';

import {TCalendarMixProps} from './types';

// Calendar mix: the selected day's events split by calendar, as one bar with a segment per calendar sized by its
// count. Counts ignore the Calendar filter; a filtered-out calendar stays in the bar, hatched instead of filled, so
// filtering never changes the shape of the day. An empty day is a dashed hairline. Decorative: the events list
// below names every event's calendar.
const CalendarMix = ({date, className}: TCalendarMixProps) => {
  const events = useEventsList(date);
  const calendarsList = useSelector(selectCalendarsList);
  const activeCalendars = useSelector(selectActiveCalendars);

  const segments = useMemo(
    () =>
      countEventsByCalendar(events, calendarsList).map(segment => ({
        ...segment,
        isDimmed: isEventDimmed(activeCalendars, segment.name),
      })),
    [calendarsList, activeCalendars, events],
  );

  if (segments.length === 0) {
    return <div aria-hidden className={cx('h-0.75 border-t border-dashed border-line-strong', className)} />;
  }

  return (
    <div aria-hidden className={cx('flex h-0.75 gap-0.5', className)}>
      {segments.map(segment => (
        <span
          key={segment.name}
          style={{...calendarColorStyle(segment.color), flexGrow: segment.count}}
          className={cx(
            'basis-0',
            segment.isDimmed
              ? 'bg-[repeating-linear-gradient(135deg,color-mix(in_srgb,var(--calendar-color)_40%,transparent)_0_2px,transparent_2px_5px)]'
              : 'bg-(--calendar-color)',
          )}
        />
      ))}
    </div>
  );
};

export default CalendarMix;
