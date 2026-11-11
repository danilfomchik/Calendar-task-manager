import {AppStoreState} from '../store';

export const selectDayNote = (date: string) => (state: AppStoreState) => state.dayNotesData.notesByDate[date];
