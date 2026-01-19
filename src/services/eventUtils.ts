import {uid} from 'uid';

import {TEvent} from '@/redux/events/types';

import {getRandomColor} from './utils';

type EventAttribs = {
  eventName: string;
  description?: string;
  date: string;
};

type TEditEventAttribs = {
  event: TEvent | undefined;
  updatedEvent: EventAttribs;
};

export const createEventObj = ({eventName, description, date}: EventAttribs) => {
  const newEvent = {
    id: uid(),
    title: eventName.trim(),
    description: description?.trim(),
    date,
    color: getRandomColor(),
  };

  return newEvent;
};

export const editEventObj = ({event, updatedEvent}: TEditEventAttribs) => {
  const editedEvent = {
    id: event?.id || '',
    title: updatedEvent.eventName.trim(),
    description: updatedEvent.description?.trim(),
    date: updatedEvent.date,
    color: event?.color || '',
  };

  return editedEvent;
};
