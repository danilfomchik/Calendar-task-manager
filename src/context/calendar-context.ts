import {RefObject, createContext} from 'react';

export const CalendarContext = createContext<RefObject<HTMLDivElement> | null>(null);
