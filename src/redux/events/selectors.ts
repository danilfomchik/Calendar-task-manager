import {AppStoreState} from '../store';

export const selectEventsByDate = (date: string) => (state: AppStoreState) => state.eventsData.events?.[date];
