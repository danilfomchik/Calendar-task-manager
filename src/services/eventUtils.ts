import {uid} from 'uid';

import {TEvent} from '@/redux/events/types';

import {CalendarsNames} from '../types/types';

type EventAttribs = {
  title: string;
  description?: string;
  date: string;
  eventCalendar: CalendarsNames;
};

type TEditEventAttribs = {
  event: TEvent | undefined;
  updatedEvent: EventAttribs;
};

export const createEventObj = ({title, description, date, eventCalendar}: EventAttribs) => {
  const newEvent = {
    id: uid(),
    title: title.trim(),
    description: description?.trim(),
    date,
    eventCalendar,
  };

  return newEvent;
};

export const editEventObj = ({event, updatedEvent}: TEditEventAttribs) => {
  const editedEvent = {
    id: event?.id || '',
    title: updatedEvent.title.trim(),
    description: updatedEvent.description?.trim(),
    date: updatedEvent.date,
    eventCalendar: updatedEvent.eventCalendar,
  };

  return editedEvent;
};
