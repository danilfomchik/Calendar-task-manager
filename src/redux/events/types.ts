import {FormActionType} from '@/types/eventFormTypes';
import {CalendarsNames} from '@/types/types';

export type TId = string;

export type TEvent = {
  id: TId;
  title: string;
  description?: string;
  date: string;
  eventCalendar: CalendarsNames;
  isDisabled?: boolean;
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
