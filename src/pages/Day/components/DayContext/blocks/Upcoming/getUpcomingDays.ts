import {TEventsByDate, TEventsById} from '@/redux/events/types';

import {shiftDay} from '../../../../helpers';

export const UPCOMING_SCAN_DAYS = 30;
export const UPCOMING_MAX_DAYS = 3;

export type TUpcomingDay = {
  date: string;
  count: number;
  firstTitle: string;
};

// The next days with events after the Viewed day (the Viewed day itself excluded), scanning up to 30 days ahead.
// Reads all events, so the Calendar filter has no effect.
export const getUpcomingDays = (date: string, eventsByDate: TEventsByDate, eventsById: TEventsById): TUpcomingDay[] => {
  const upcoming: TUpcomingDay[] = [];

  for (let offset = 1; offset <= UPCOMING_SCAN_DAYS && upcoming.length < UPCOMING_MAX_DAYS; offset++) {
    const day = shiftDay(date, offset);
    const events = (eventsByDate[day] ?? []).flatMap(id => eventsById[id] ?? []);

    if (events.length) upcoming.push({date: day, count: events.length, firstTitle: events[0].title});
  }

  return upcoming;
};
