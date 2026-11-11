import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {getLocalStoredValues} from '@/services/utils';
import {StorageKeys} from '@/types/types';

import {SliceNames} from '../types';
import {TDayNotesState, TSetDayNotePayload} from './types';

// Hydrated synchronously at start-up, like the events slice
const initialState: TDayNotesState = {
  notesByDate: getLocalStoredValues(StorageKeys.dayNotes, {}),
};

const dayNotesSlice = createSlice({
  name: SliceNames.dayNotesSlice,
  initialState,
  reducers: {
    // An emptied (blank) note is removed rather than stored
    setDayNote: (state, action: PayloadAction<TSetDayNotePayload>) => {
      const {date, text} = action.payload;

      if (text.trim()) {
        state.notesByDate[date] = text;
      } else {
        delete state.notesByDate[date];
      }
    },
  },
});

export const {setDayNote} = dayNotesSlice.actions;
export default dayNotesSlice;
