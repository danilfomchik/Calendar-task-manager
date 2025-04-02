import moment, {Moment} from 'moment';

import {Format} from './types';

export const currentDate = moment(new Date());

export const formatDate = (date: Moment, format: Format) => {
    return date.format(format);
};

export const getDaysAmount = (year: string, month: string) => {
    const amountOfDays = moment([year, +month - 1]).daysInMonth();

    return Array.from({length: amountOfDays}, (_, i) => (i + 1 < 10 ? `0${i + 1}` : `${i + 1}`));
};

export const getYearsOptions = () => {
    const currentYear = moment().year();
    const startYear = currentYear - 10; // Adjust the range as needed

    return Array.from({length: 30}, (_, i) => (startYear + i).toString());
};

export const getMonthsOptions = () => moment.months();

export const getDaysOptions = (year: string, month: string) => {
    const formatefMonth = formatDate(moment().month(month), 'M');

    return getDaysAmount(year, formatefMonth);
};
