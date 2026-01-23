import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {SliceNames} from '../types';
import {TOverflowState} from './types';

const reducers = {
  onOpenItem: (state: TOverflowState, action: PayloadAction<string>) => {
    const {payload} = action;

    state.currentlyOpened.push(payload);
  },
  onCloseItem: (state: TOverflowState, action: PayloadAction<string>) => {
    const {payload} = action;

    state.currentlyOpened = state.currentlyOpened.filter(item => item !== payload);
  },
};

const initialState: TOverflowState = {
  currentlyOpened: [],
};

const overflowSlice = createSlice({
  name: SliceNames.overflowSlice,
  initialState,
  reducers,
});

export const {onOpenItem, onCloseItem} = overflowSlice.actions;
export default overflowSlice;
