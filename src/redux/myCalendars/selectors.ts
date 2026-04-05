import {RootState} from '../store';

export const selectSelectedCalendar = (state: RootState) => state.myCalendarsData.selectedCalendar;
export const selectCalendarsList = (state: RootState) => state.myCalendarsData.calendarsList;
