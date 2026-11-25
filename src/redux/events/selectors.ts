import {AppStoreState} from '../store';

export const selectEventsByDate = (date: string) => (state: AppStoreState) => state.eventsData.eventsByDate[date];
// A day's ids resolved to events (a fresh array on every call: compare it item by item, as useEventsList does). An id
// missing from eventsById resolves to undefined, as it always has here
export const selectDayEvents = (state: AppStoreState, date: string) =>
  state.eventsData.eventsByDate[date]?.map(id => state.eventsData.eventsById[id]);
export const selectAllEventsByDate = (state: AppStoreState) => state.eventsData.eventsByDate;
export const selectEventsById = (state: AppStoreState) => state.eventsData.eventsById;
export const selectEventFormData = (state: AppStoreState) => state.eventsData.eventFormData;
export const selectHasAnyEvents = (state: AppStoreState) => Object.keys(state.eventsData.eventsById).length > 0;
