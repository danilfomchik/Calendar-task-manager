import {uid} from 'uid';

import {TEvent} from '@/redux/events/types';

import {StorageKeys} from './types';

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

export const getLocalStoredValues = (key: StorageKeys, defaultValues?: unknown) => {
  const storedValues = localStorage.getItem(key);
  const parsedValues = storedValues ? JSON.parse(storedValues) : defaultValues;

  return parsedValues;
};

export const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;
};
