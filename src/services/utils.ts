import moment, {Moment} from 'moment';

import {Format} from './types';

export const currentDate = moment(new Date());

export const formatDate = (date: Moment, format: Format) => {
    return date.format(format);
};
