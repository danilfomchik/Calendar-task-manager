import {createSlice} from '@reduxjs/toolkit';

import {SliceNames} from '../types';
import {TOverflowState} from './types';

const reducers = {
    increaseOpenedItems: (state: TOverflowState) => {
        state.openedItems += 1;
    },
    decreaseOpenedItems: (state: TOverflowState) => {
        const openedItems = state.openedItems;

        if (openedItems > 0) {
            state.openedItems -= 1;
        }
    },
};

const initialState: TOverflowState = {
    openedItems: 0,
};

const overflowSlice = createSlice({
    name: SliceNames.overflowSlice,
    initialState,
    reducers,
});

export const {increaseOpenedItems, decreaseOpenedItems} = overflowSlice.actions;
export default overflowSlice;
