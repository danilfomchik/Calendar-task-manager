import {CalendarsNames} from './types';

export const TOTAL_DAYS_IN_MONTH = 42;
export const CURRENT_DATE_PARAMS_KEY = 'selectedDate';

// TODO: add abillity to customize (CRUD)
export const defaultCalendars = [
  {
    name: CalendarsNames.work,
    itemColor: '#4a6cf7',
  },
  {
    name: CalendarsNames.personal,
    itemColor: '#a855f7',
  },
  {
    name: CalendarsNames.health,
    itemColor: '#34d399',
  },
  {
    name: CalendarsNames.holidays,
    itemColor: '#f59e0b',
  },
];
