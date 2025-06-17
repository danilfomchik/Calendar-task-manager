import {uid} from 'uid';

import {StorageKeys} from './types';

type CreateEventProps = {
    eventName: string;
    description?: string;
    date: string;
};

export const createEvent = ({eventName, description, date}: CreateEventProps) => {
    const newEvent = {
        id: uid(),
        title: eventName.trim(),
        description: description?.trim(),
        date,
        color: getRandomColor(),
    };

    return newEvent;
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
