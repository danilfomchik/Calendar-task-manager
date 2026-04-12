import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {CalendarsNames} from '@/services/types';

import {SliceNames} from '../types';
import {TMyCalendarsState} from './types';

const reducers = {
  // TODO: add setCalendarsList reducer
  setSelectedCalendar: (state: TMyCalendarsState, action: PayloadAction<CalendarsNames | null>) => {
    state.selectedCalendar = action.payload;
  },
};

const initialState: TMyCalendarsState = {
  // TODO: generate list from localStorage
  calendarsList: [
    {
      name: CalendarsNames.work,
      count: 5,
      itemColor: '#4A6CF7',
    },
    {
      name: CalendarsNames.personal,
      count: 8,
      itemColor: '#a855f7',
    },
    {
      name: CalendarsNames.health,
      count: 3,
      itemColor: '#34d399',
    },
    {
      name: CalendarsNames.holidays,
      count: 2,
      itemColor: '#f59e0b',
    },
  ],
  selectedCalendar: null,
};

const myCalendarsSlice = createSlice({
  name: SliceNames.myCalendarsSlice,
  initialState,
  reducers,
});

export const {setSelectedCalendar} = myCalendarsSlice.actions;
export default myCalendarsSlice;
