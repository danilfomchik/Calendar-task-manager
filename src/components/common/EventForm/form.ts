import {mixed, object, string} from 'yup';

import {CalendarsNames} from '@/types/types';

export const validation = object().shape({
  eventTitle: string()
    .required('Give the event a title')
    .test('empty-check', 'Give the event a title', name => !!name.trim().length),
  eventYear: string().required(),
  eventMonth: string().required(),
  eventDay: string().required(),
  eventDescription: string(),
  eventCalendar: mixed<CalendarsNames>().oneOf(Object.values(CalendarsNames)).required('Calendar is required'),
});
