import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import moment from 'moment';

import {SliceNames} from '../types';
import {TDateState, TSetFullDateAction} from './types';
import {currentDate, formatDate} from '@/services/utils';

const reducers = {
    setFullDate: (state: TDateState, action: PayloadAction<TSetFullDateAction['payload']>) => {
        const changedDate = action.payload;

        state.fullDate = changedDate;
        state.year = formatDate(moment(changedDate), 'YYYY');
        state.month = formatDate(moment(changedDate), 'MMMM');
    },
};

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
