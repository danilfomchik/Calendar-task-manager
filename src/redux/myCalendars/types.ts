import {CalendarsNames, Nullable, TCalendarsList} from '@/services/types';

export type TMyCalendarsState = {
  calendarsList: TCalendarsList;
  selectedCalendar: Nullable<CalendarsNames>;
  calendarsMap: Record<string, Record<CalendarsNames, number>>;
};

export enum EventsCountChangeKind {
  ADD = 'add',
  DELETE = 'delete',
}
