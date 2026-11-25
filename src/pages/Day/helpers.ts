import moment from 'moment';

import {DATE_KEY_FORMAT, formatDate} from '@/services/dateUtils';

// Monday to Sunday of the ISO week that contains `date`
export const getWeekDates = (date: string) => {
  const monday = moment(date).startOf('isoWeek');

  return Array.from({length: 7}, (_, i) => formatDate(monday.clone().add(i, 'day'), DATE_KEY_FORMAT));
};

// ISO week number: the app's locale week() (Monday start, week 1 holds 1 January) is not ISO
export const getWeekNumber = (date: string) => moment(date).isoWeek();
