import {defaultCalendars} from '@/services/constants';
import {CalendarsNames} from '@/services/types';

import {EventsCountChangeKind} from './types';

export const handleEventsCountChangeInMap = (
  eventsCalendarsMap: Record<string, Record<CalendarsNames, number>>,
  yearMonthKey: string,
  calendarName: CalendarsNames,
  kind: EventsCountChangeKind,
) => {
  // Deep copy the map to avoid mutating the original
  const updatedEventsCalendarsMap = Object.keys(eventsCalendarsMap).reduce(
    (acc, key) => {
      acc[key] = {...eventsCalendarsMap[key]};
      return acc;
    },
    {} as Record<string, Record<CalendarsNames, number>>,
  );

  const currentDateCalendars = updatedEventsCalendarsMap[yearMonthKey];

  if (!currentDateCalendars) {
    updatedEventsCalendarsMap[yearMonthKey] = defaultCalendars.reduce(
      (acc, calendar) => ({...acc, [calendar.name]: 0}),
      {} as Record<CalendarsNames, number>,
    );
    updatedEventsCalendarsMap[yearMonthKey][calendarName] = kind === EventsCountChangeKind.ADD ? 1 : 0;
  } else {
    updatedEventsCalendarsMap[yearMonthKey][calendarName] += kind === EventsCountChangeKind.ADD ? 1 : -1;
  }

  // indicates that record has no event for any calendar
  const hasNoEvents =
    kind === EventsCountChangeKind.DELETE ? Math.max(...Object.values(currentDateCalendars)) === 0 : false;

  // leave only those records which has events
  if (hasNoEvents) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {[yearMonthKey]: _, ...rest} = updatedEventsCalendarsMap;

    return rest;
  }

  return updatedEventsCalendarsMap;
};
