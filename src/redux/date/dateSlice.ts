import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import moment from 'moment';

import {
  TWeekDirection,
  WEEK_LENGTH,
  formatDate,
  getDate,
  getInitialWeekStart,
  getWeekOwnerDate,
  isSameMonth,
  shiftDate,
} from '@/services/dateUtils';

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
    state.weekStart = getInitialWeekStart(changedDate);
  },
  setIsCollapsed: (state: TDateState, action: PayloadAction<boolean>) => {
    state.isCollapsed = action.payload;

    if (action.payload) {
      state.weekStart = getInitialWeekStart(state.fullDate);
    }
  },
  // moves the week strip; the visible month follows the month the new week belongs to (see getWeekOwnerDate)
  // the selected date moves together with the week so the selected day stays at the same weekday
  shiftWeek: (state: TDateState, action: PayloadAction<TWeekDirection>) => {
    const direction = action.payload;

    state.weekStart = shiftDate(state.weekStart, direction * WEEK_LENGTH);
    state.selectedDate = shiftDate(state.selectedDate, direction * WEEK_LENGTH);

    const ownerDate = getWeekOwnerDate(state.weekStart);

    if (!isSameMonth(ownerDate, state.fullDate)) {
      applyVisibleMonth(state, ownerDate);
    }
  },
  setSelectedDate: (state: TDateState, action: PayloadAction<string>) => {
    state.selectedDate = action.payload;
  },
};

const currentDate = getDate(new Date());

const initialState: TDateState = {
  fullDate: formatDate(currentDate, 'YYYY-MM-DD'),
  year: formatDate(currentDate, 'YYYY'),
  month: formatDate(currentDate, 'MMMM'),
  day: formatDate(currentDate, 'DD'),
  selectedDate: formatDate(currentDate, 'YYYY-MM-DD'),
  isCollapsed: false,
  weekStart: getInitialWeekStart(formatDate(currentDate, 'YYYY-MM-DD')),
};

const dateSlice = createSlice({
  name: SliceNames.dateSlice,
  initialState,
  reducers,
});

export const {setFullDate, setSelectedDate, setIsCollapsed, shiftWeek} = dateSlice.actions;
export default dateSlice;
