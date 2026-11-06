import {RootState} from '../store';

export const selectActiveCalendars = (state: RootState) => state.myCalendarsData.activeCalendars;
export const selectCalendarsList = (state: RootState) => state.myCalendarsData.calendarsList;
export const selectCalendarsMap = (state: RootState) => state.myCalendarsData.calendarsMap;
