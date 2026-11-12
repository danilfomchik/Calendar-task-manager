import {TEvent, TEventsByDate, TEventsById} from '@/redux/events/types';

import {shiftDay} from '../../../../helpers';

export const UPCOMING_SCAN_DAYS = 30;
export const UPCOMING_MAX_DAYS = 3;
export const UPCOMING_MAX_EVENTS_PER_DAY = 3;
// Across all days, so a busy week stops adding days instead of stretching the drawer
export const UPCOMING_MAX_EVENTS = 6;

export type TUpcomingDay = {
  date: string;
  // every event of the day
  count: number;
  // the first few of them, as stored
  events: TEvent[];
};

// The next days with events after the Viewed day (the Viewed day itself excluded), scanning up to 30 days ahead,
// each with up to 3 events and at most 6 events in all. Reads all events, so the Calendar filter has no effect.
export const getUpcomingDays = (date: string, eventsByDate: TEventsByDate, eventsById: TEventsById): TUpcomingDay[] => {
  const upcoming: TUpcomingDay[] = [];
  let shown = 0;

  for (
    let offset = 1;
    offset <= UPCOMING_SCAN_DAYS && upcoming.length < UPCOMING_MAX_DAYS && shown < UPCOMING_MAX_EVENTS;
    offset++
  ) {
    const day = shiftDay(date, offset);
    const events = (eventsByDate[day] ?? []).flatMap(id => eventsById[id] ?? []);

    if (!events.length) continue;

    const visible = events.slice(0, Math.min(UPCOMING_MAX_EVENTS_PER_DAY, UPCOMING_MAX_EVENTS - shown));

    shown += visible.length;
    upcoming.push({date: day, count: events.length, events: visible});
  }

  return upcoming;
};
