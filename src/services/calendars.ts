import {TEvent, TLegacyEvent} from '@/redux/events/types';
import {CalendarsNames} from '@/types/types';

import {isCalendarColorAllowed} from './colorDistance';
import {defaultCalendars} from './constants';

// The mark for an event whose calendar is unknown: a neutral, faint ink rather than a calendar hue, so it never reads
// as a calendar or as interface colour (overview.md, "Two colour channels")
export const UNKNOWN_CALENDAR_COLOR = 'var(--color-text-faint)';

export const getCalendarColor = (calendar: CalendarsNames | undefined): string =>
  defaultCalendars.find(c => c.name === calendar)?.itemColor ?? UNKNOWN_CALENDAR_COLOR;

// Events saved before calendars existed have no `eventCalendar`, only their own `color` (a random hex). Use it when it
// keeps clear of the interface channels; otherwise fall back to the neutral mark. Stored data is never rewritten.
export const getEventColor = (event: TEvent): string => {
  if (defaultCalendars.some(c => c.name === event.eventCalendar)) return getCalendarColor(event.eventCalendar);

  const legacyColor = (event as TLegacyEvent).color;

  return typeof legacyColor === 'string' && isCalendarColorAllowed(legacyColor) ? legacyColor : UNKNOWN_CALENDAR_COLOR;
};
