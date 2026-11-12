import moment from 'moment';

import {DATE_KEY_FORMAT, formatDate, formatEventsCount} from '@/services/dateUtils';

export const shiftDay = (date: string, days: number) => formatDate(moment(date).add(days, 'day'), DATE_KEY_FORMAT);

// Monday to Sunday of the ISO week that contains `date`
export const getWeekDates = (date: string) => {
  const monday = moment(date).startOf('isoWeek');

  return Array.from({length: 7}, (_, i) => formatDate(monday.clone().add(i, 'day'), DATE_KEY_FORMAT));
};

// ISO week number: the 'uk' locale is not bundled, so moment's locale week() is not ISO
export const getWeekNumber = (date: string) => moment(date).isoWeek();

// "Monday 9 November, 3 events"
export const getDayCellLabel = (date: string, count: number) =>
  `${formatDate(moment(date), 'dddd D MMMM')}, ${formatEventsCount(count)}`;
