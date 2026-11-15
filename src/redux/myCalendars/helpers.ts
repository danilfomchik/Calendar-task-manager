import {defaultCalendars} from '@/services/constants';
import {CalendarsNames, TCalendarsList} from '@/types/types';

import {TEvent} from '../events/types';
import {EventsCountChangeKind, TCalendarEventsCount} from './types';

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

// an event is dimmed only when a non-empty calendar filter excludes its calendar
export const isEventDimmed = (activeCalendars: CalendarsNames[], eventCalendar: CalendarsNames) =>
  activeCalendars.length > 0 && !activeCalendars.includes(eventCalendar);

// A day's events counted per calendar, in the calendars' own order; calendars without events are left out
export const countEventsByCalendar = (
  events: TEvent[] | undefined,
  calendars: TCalendarsList,
): TCalendarEventsCount[] =>
  calendars
    .map(({name, itemColor}) => ({
      name,
      color: itemColor,
      count: events?.filter(event => event.eventCalendar === name).length ?? 0,
    }))
    .filter(calendar => calendar.count > 0);
