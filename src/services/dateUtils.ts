import moment, {Moment, MomentInput} from 'moment';

import {MonthParts} from '../types/types';
import {TOTAL_DAYS_IN_MONTH} from './constants';

export const getDate = (date: MomentInput) => {
  return moment(date);
};

export const createDate = (year: number, month: string, day: number) => {
  return moment().year(year).month(month).date(day).format('YYYY-MM-DD');
};

export const formatDate = (date: Moment, format: string) => {
  return date.format(format);
};

export const getWeekDays = () => moment.weekdays(true);
export const getMonthsOptions = () => moment.months();

export const getYearsOptions = () => {
  const currentYear = moment().year();
  const startYear = currentYear - 10; // Adjust the range as needed

  return Array.from({length: 30}, (_, i) => (startYear + i).toString());
};

export const getMonthIndex = (month: string) => {
  return formatDate(moment().month(month), 'M');
};

export const getDays = (year: string, month: string) => {
  const monthIndex = getMonthIndex(month);
  const amountOfDays = moment([year, +monthIndex - 1]).daysInMonth();

  return Array.from({length: amountOfDays}, (_, i) => (i + 1 < 10 ? `0${i + 1}` : `${i + 1}`));
};

export const generateDatesArray = (year: string, month: string) => {
  const monthIndex = getMonthIndex(month);

  const startDate = moment(`${year}-${monthIndex}`, 'YYYY-M');
  const prevMonth = moment(startDate).add(-1, 'M');
  const nextMonth = moment(startDate).add(1, 'M');

  const prevMonthDates = generateDatesArrayByFullDate(prevMonth);
  const currentMonthDates = generateDatesArrayByFullDate(startDate);
  const nextMonthDates = generateDatesArrayByFullDate(nextMonth);

  const firstDateOfCurrentMonth = moment(currentMonthDates[0]);
  const firstDateOfCurrentMonthIndex = firstDateOfCurrentMonth.weekday();

  const partOfPrevMonthDates = getPartOfMonthDates(prevMonthDates, firstDateOfCurrentMonthIndex, MonthParts.END);
  const partOfNextMonthDates = getPartOfMonthDates(
    nextMonthDates,
    TOTAL_DAYS_IN_MONTH - [...partOfPrevMonthDates, ...currentMonthDates].length,
    MonthParts.START,
  );

  return [...partOfPrevMonthDates, ...currentMonthDates, ...partOfNextMonthDates];
};

const getPartOfMonthDates = (dates: string[], amountOfDays: number, part: MonthParts) => {
  if (part === MonthParts.START) {
    return dates.slice(0, amountOfDays);
  }

  return dates.slice(dates.length - amountOfDays);
};

const generateDatesArrayByFullDate = (date: Moment) => {
  const dates = [];
  const daysInMonth = date.daysInMonth();

  for (let i = 0; i < daysInMonth; i++) {
    dates.push(date.clone().add(i, 'days').format('YYYY-MM-DD'));
  }

  return dates;
};

export const WEEK_LENGTH = 7;

export type TWeekDirection = 1 | -1;

const DATE_FORMAT = 'YYYY-MM-DD';

// first day of the week (locale-aware, Monday-first) that contains the given date
export const getWeekStart = (date: MomentInput) => moment(date).startOf('week').format(DATE_FORMAT);

// current month -> week of today; any other month -> week containing the 1st
export const getInitialWeekStart = (fullDate: string) => {
  const today = moment();
  const visibleMonth = moment(fullDate);

  return getWeekStart(visibleMonth.isSame(today, 'month') ? today : visibleMonth.startOf('month'));
};

export const isSameMonth = (a: string, b: string) => moment(a).isSame(b, 'month');

export const shiftDate = (date: string, days: number) => moment(date).add(days, 'days').format(DATE_FORMAT);

export const generateWeekDates = (weekStart: string) =>
  Array.from({length: WEEK_LENGTH}, (_, i) => shiftDate(weekStart, i));

// A date inside the month the week belongs to. A week containing today always belongs to today's month;
// otherwise it belongs to the month of its last day (so a week containing the 1st belongs to that month).
export const getWeekOwnerDate = (weekStart: string) => {
  const today = moment().format(DATE_FORMAT);
  const weekEnd = shiftDate(weekStart, WEEK_LENGTH - 1);

  return today >= weekStart && today <= weekEnd ? today : weekEnd;
};

// position of the week among the weeks that belong to the visible month
export const getWeekPositionInMonth = (fullDate: string, weekStart: string) => {
  const month = moment(fullDate);
  const firstWeekStart = getWeekStart(month.clone().startOf('month'));
  const ownedWeeks = Array.from({length: 8}, (_, i) => shiftDate(firstWeekStart, (i - 1) * WEEK_LENGTH)).filter(week =>
    moment(getWeekOwnerDate(week)).isSame(month, 'month'),
  );

  const index = ownedWeeks.indexOf(weekStart);

  return {total: ownedWeeks.length, index: Math.max(index, 0)};
};
