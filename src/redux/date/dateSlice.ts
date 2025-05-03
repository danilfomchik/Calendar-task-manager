import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import moment from 'moment';

import {formatDate, getDate} from '@/services/utils';

import {SliceNames} from '../types';
import {TDateState} from './types';

const reducers = {
    setFullDate: (state: TDateState, action: PayloadAction<string>) => {
        const changedDate = action.payload;

        state.fullDate = changedDate;
        state.year = formatDate(moment(changedDate), 'YYYY');
        state.month = formatDate(moment(changedDate), 'MMMM');
    },
};

const currentDate = getDate(new Date());

const initialState: TDateState = {
    fullDate: formatDate(currentDate, 'YYYY-MM-DD'),
    year: formatDate(currentDate, 'YYYY'),
    month: formatDate(currentDate, 'MMMM'),
    day: formatDate(currentDate, 'DD'),
};

const dateSlice = createSlice({
    name: SliceNames.dateSlice,
    initialState,
    reducers,
});

export const {setFullDate} = dateSlice.actions;
export default dateSlice;
