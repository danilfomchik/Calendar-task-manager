import {CalendarsNames} from '../types/types';

// The app's name (sidebar and browser tab); a placeholder until the product is named (PRODUCT.md)
export const APP_TITLE = 'Calendar';

export const TOTAL_DAYS_IN_MONTH = 42;
export const EVENT_FORM_ID = 'event-form';
// the event form's heading, which names its dialog
export const EVENT_FORM_TITLE_ID = 'event-form-title';

// Calendar colours stay clear of the interface channels (green action, blue info/today, rose danger): every one is at
// least MIN_CALENDAR_INTERFACE_DELTA_E (services/colorDistance.ts) from each. Events store only the calendar name, so a
// change here recolours existing events too.
export const defaultCalendars = [
  {
    name: CalendarsNames.work,
    itemColor: '#8b5cf6',
  },
  {
    name: CalendarsNames.personal,
    itemColor: '#e046e8',
  },
  {
    name: CalendarsNames.health,
    itemColor: '#facc15',
  },
  {
    name: CalendarsNames.holidays,
    itemColor: '#c2410c',
  },
];
