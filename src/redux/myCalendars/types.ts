import {CalendarsNames, Nullable, TCalendarsList} from '@/services/types';

export type TMyCalendarsState = {
  calendarsList: TCalendarsList;
  selectedCalendar: Nullable<CalendarsNames>;
};
