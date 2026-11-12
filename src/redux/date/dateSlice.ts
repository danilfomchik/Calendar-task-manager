import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import moment from 'moment';

import {TDirection, formatDate, getDate} from '@/services/dateUtils';

import {SliceNames} from '../types';
import {TDateState} from './types';

// fullDate, year and month always change together
const applyVisibleMonth = (state: TDateState, date: string) => {
  state.fullDate = date;
  state.year = formatDate(moment(date), 'YYYY');
  state.month = formatDate(moment(date), 'MMMM');
};

const reducers = {
  setFullDate: (state: TDateState, action: PayloadAction<string>) => {
    const changedDate = action.payload;

    applyVisibleMonth(state, changedDate);
  },
  // same as the header arrows: moves the visible month, selected date stays untouched
  shiftMonth: (state: TDateState, action: PayloadAction<TDirection>) => {
    const changedDate = formatDate(moment(state.fullDate).add(action.payload, 'M'), 'YYYY-MM-DD');

    applyVisibleMonth(state, changedDate);
  },
  setSelectedDate: (state: TDateState, action: PayloadAction<string>) => {
    state.selectedDate = action.payload;
  },
  requestToday: (state: TDateState) => {
    state.todayRequests += 1;
  },
  markMonthGridShown: (state: TDateState) => {
    state.hasShownMonthGrid = true;
  },
};

const currentDate = getDate(new Date());

const initialState: TDateState = {
  fullDate: formatDate(currentDate, 'YYYY-MM-DD'),
  year: formatDate(currentDate, 'YYYY'),
  month: formatDate(currentDate, 'MMMM'),
  day: formatDate(currentDate, 'DD'),
  selectedDate: formatDate(currentDate, 'YYYY-MM-DD'),
  hasShownMonthGrid: false,
  todayRequests: 0,
};

const dateSlice = createSlice({
  name: SliceNames.dateSlice,
  initialState,
  reducers,
});

export const {setFullDate, setSelectedDate, shiftMonth, markMonthGridShown, requestToday} = dateSlice.actions;
export default dateSlice;
