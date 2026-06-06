import {AppStoreState} from '../store';

export const selectEventsByDate = (date: string) => (state: AppStoreState) => state.eventsData.eventsByDate[date];
export const selectEventsById = (state: AppStoreState) => state.eventsData.eventsById;
export const selectEventFormData = (state: AppStoreState) => state.eventsData.eventFormData;
