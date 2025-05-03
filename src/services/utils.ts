import moment, {Moment, MomentInput} from 'moment';

import {TOTAL_DAYS_IN_MONTH} from './constants';
import {Format, MonthParts} from './types';

export const getDate = (date: MomentInput) => {
    return moment(date);
};

export const formatDate = (date: Moment, format: Format) => {
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
