import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {SliceNames} from '../types';
import {TOpeningItem, TOverflowState} from './types';
import {toggleOverflowItem} from './utils';

const reducers = {
    onOpenItem: (state: TOverflowState, action: PayloadAction<string>) => {
        const {payload} = action;

        state.currentlyOpened.push(payload);
        state.itemsToOpen = toggleOverflowItem(state.itemsToOpen, payload, true);
    },
    onCloseItem: (state: TOverflowState, action: PayloadAction<string>) => {
        const {payload} = action;

        state.currentlyOpened = state.currentlyOpened.filter(item => item !== payload);
        state.itemsToOpen = toggleOverflowItem(state.itemsToOpen, payload, false);
    },
    addItemToOpen: (state: TOverflowState, action: PayloadAction<TOpeningItem>) => {
        const {payload} = action;

        const newItem = {
            id: payload.id,
            isOpen: payload.isOpen,
        };

        if (payload && !state.itemsToOpen.some(item => item.id === payload.id)) {
            state.itemsToOpen.push(newItem);
        }
    },
    removeItemFromOpen: (state: TOverflowState, action: PayloadAction<string | null>) => {
        const {payload} = action;

        state.currentlyOpened = state.currentlyOpened.filter(item => item !== payload);
        state.itemsToOpen = state.itemsToOpen.filter(item => item.id !== payload);
    },
};

const initialState: TOverflowState = {
    currentlyOpened: [],
    itemsToOpen: [],
};

const overflowSlice = createSlice({
    name: SliceNames.overflowSlice,
    initialState,
    reducers,
});

export const {addItemToOpen, removeItemFromOpen, onOpenItem, onCloseItem} = overflowSlice.actions;
export default overflowSlice;
