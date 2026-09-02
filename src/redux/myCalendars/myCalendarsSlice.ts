import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import moment from 'moment';

import {defaultCalendars} from '@/services/constants';
import {formatDate} from '@/services/dateUtils';
import {CalendarsNames, TCalendarsList} from '@/types/types';

import {addEvent, deleteEvent, editEvent} from '../events/eventsSlice';
import {SliceNames} from '../types';
import {handleEventsCountChangeInMap} from './helpers';
import {EventsCountChangeKind, TMyCalendarsState} from './types';

const reducers = {
  setCalendarsList: (state: TMyCalendarsState, action: PayloadAction<TCalendarsList>) => {
    state.calendarsList = action.payload;
  },
  setCalendarsMap: (
    state: TMyCalendarsState,
    action: PayloadAction<Record<string, Record<CalendarsNames, number>>>,
  ) => {
    state.calendarsMap = action.payload;
  },
  setSelectedCalendar: (state: TMyCalendarsState, action: PayloadAction<CalendarsNames | null>) => {
    state.selectedCalendar = action.payload;
  },
};

const initialState: TMyCalendarsState = {
  calendarsList: defaultCalendars,
  selectedCalendar: null,
  calendarsMap: {},
};

const myCalendarsSlice = createSlice({
  name: SliceNames.myCalendarsSlice,
  initialState,
  reducers,
  extraReducers(builder) {
    builder
      .addCase(addEvent, (state, action) => {
        const event = action.payload;

        const yearMonthKey = formatDate(moment(event.date), 'YYYY-MM');

        state.calendarsMap = handleEventsCountChangeInMap(
          state.calendarsMap,
          yearMonthKey,
          event.eventCalendar,
          EventsCountChangeKind.ADD,
        );
      })
      .addCase(deleteEvent, (state, action) => {
        const event = action.payload;

        const yearMonthKey = formatDate(moment(event.date), 'YYYY-MM');

        state.calendarsMap = handleEventsCountChangeInMap(
          state.calendarsMap,
          yearMonthKey,
          event.eventCalendar,
          EventsCountChangeKind.DELETE,
        );
      })
      .addCase(editEvent, (state, action) => {
        const {oldEvent, newEvent} = action.payload;
        const oldCalendar = oldEvent.eventCalendar;
        const newCalendar = newEvent.eventCalendar;

        if (oldCalendar !== newCalendar || oldEvent.date !== newEvent.date) {
          const oldEventYearMonthKey = formatDate(moment(oldEvent.date), 'YYYY-MM');
          const newEventYearMonthKey = formatDate(moment(newEvent.date), 'YYYY-MM');

          const calendarsMap = state.calendarsMap;

          state.calendarsMap = handleEventsCountChangeInMap(
            handleEventsCountChangeInMap(calendarsMap, newEventYearMonthKey, newCalendar, EventsCountChangeKind.ADD),
            oldEventYearMonthKey,
            oldCalendar,
            EventsCountChangeKind.DELETE,
          );
        }
      });
  },
});

export const {setSelectedCalendar, setCalendarsList, setCalendarsMap} = myCalendarsSlice.actions;
export default myCalendarsSlice;
