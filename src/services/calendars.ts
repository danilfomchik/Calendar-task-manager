import {CalendarsNames} from '@/services/types';

import {defaultCalendars} from './constants';

export const getCalendarColor = (calendar: CalendarsNames): string | undefined => {
  return defaultCalendars.filter(c => c.name === calendar)[0]?.itemColor || '#ffffff';
};
