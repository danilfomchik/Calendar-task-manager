import {CalendarsNames, TCalendarsList} from '@/types/types';

export type TMyCalendarsState = {
  calendarsList: TCalendarsList;
  activeCalendars: CalendarsNames[];
  calendarsMap: Record<string, Record<CalendarsNames, number>>;
};

export enum EventsCountChangeKind {
  ADD = 'add',
  DELETE = 'delete',
}
