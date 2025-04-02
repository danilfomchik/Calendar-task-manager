import {AppStoreState} from '../store';

export const selectFullDate = (state: AppStoreState) => state.dateData.fullDate;
export const selectYear = (state: AppStoreState) => state.dateData.year;
export const selectMonth = (state: AppStoreState) => state.dateData.month;
export const selectDay = (state: AppStoreState) => state.dateData.day;
