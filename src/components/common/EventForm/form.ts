import {mixed, object, string} from 'yup';

import {CalendarsNames} from '@/services/types';

export const validation = object().shape({
  eventTitle: string()
    .required('Name is required')
    .test('empty-check', 'Event name can not be empty string.', name => !!name.trim().length),
  eventYear: string().required(),
  eventMonth: string().required(),
  eventDay: string().required(),
  eventDescription: string(),
  eventCalendar: mixed<CalendarsNames>().oneOf(Object.values(CalendarsNames)).required('Calendar is required'),
});
