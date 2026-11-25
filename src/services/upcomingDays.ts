import {TEvent, TEventsByDate, TEventsById} from '@/redux/events/types';
import {shiftDay} from '@/services/dateUtils';

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

export type TUpcomingLimits = {
  scanDays: number;
  maxDays: number;
  maxEventsPerDay: number;
  maxEvents: number;
};

const DAY_CONTEXT_LIMITS: TUpcomingLimits = {
  scanDays: UPCOMING_SCAN_DAYS,
  maxDays: UPCOMING_MAX_DAYS,
  maxEventsPerDay: UPCOMING_MAX_EVENTS_PER_DAY,
  maxEvents: UPCOMING_MAX_EVENTS,
};

// The next days with events after `date` (that date itself excluded). By default (the Day context's Upcoming block)
// it scans up to 30 days ahead, each day with up to 3 events and at most 6 events in all; Home's free-day list passes
// its own limits. Reads all events, so the Calendar filter has no effect.
export const getUpcomingDays = (
  date: string,
  eventsByDate: TEventsByDate,
  eventsById: TEventsById,
  limits: TUpcomingLimits = DAY_CONTEXT_LIMITS,
): TUpcomingDay[] => {
  const {scanDays, maxDays, maxEventsPerDay, maxEvents} = limits;
  const upcoming: TUpcomingDay[] = [];
  let shown = 0;

  for (let offset = 1; offset <= scanDays && upcoming.length < maxDays && shown < maxEvents; offset++) {
    const day = shiftDay(date, offset);
    const events = (eventsByDate[day] ?? []).flatMap(id => eventsById[id] ?? []);

    if (!events.length) continue;

    const visible = events.slice(0, Math.min(maxEventsPerDay, maxEvents - shown));

    shown += visible.length;
    upcoming.push({date: day, count: events.length, events: visible});
  }

  return upcoming;
};
