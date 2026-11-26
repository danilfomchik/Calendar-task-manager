import {FormActionType} from '@/types/eventFormTypes';
import {CalendarsNames} from '@/types/types';

export type TId = string;

export type TEvent = {
  id: TId;
  title: string;
  description?: string;
  date: string;
  eventCalendar: CalendarsNames;
};

// An event as it may come back from localStorage: ones saved before calendars existed carry their own `color`
// (a random hex) instead of a usable `eventCalendar`. Stored data is never rewritten, so the field is read defensively.
export type TLegacyEvent = TEvent & {
  color?: unknown;
};

export type TEventsById = {
  [key: string]: TEvent;
};

export type TEventsByDate = {
  [key: string]: string[] | undefined;
};

export type TEventsState = {
  eventsById: TEventsById;
  eventsByDate: TEventsByDate;
  eventFormData: {
    actionType: FormActionType;
    event?: TEvent;
    date?: string;
  } | null;
};
