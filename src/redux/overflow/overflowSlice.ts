import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {SliceNames} from '../types';
import {TOverflowState} from './types';

const reducers = {
    onOpenItem: (state: TOverflowState, action: PayloadAction<string>) => {
        const {payload} = action;

        state.currentlyOpened.push(payload);

        state.itemsToOpen = state.itemsToOpen.map(item => {
            if (item.id === payload) {
                return {
                    ...item,
                    isOpen: true,
                };
            }

            return item;
        });
    },
    onCloseItem: (state: TOverflowState, action: PayloadAction<string | null>) => {
        const {payload} = action;

        state.currentlyOpened = state.currentlyOpened.filter(item => item !== payload);
        state.itemsToOpen = state.itemsToOpen.map(item => {
            if (item.id === payload) {
                return {
                    ...item,
                    isOpen: false,
                };
            }

            return item;
        });
    },
    addItemToOpen: (
        state: TOverflowState,
        action: PayloadAction<
            | {
                  id: string;
                  isOpen: boolean;
              }
            | string
        >,
    ) => {
        const {payload} = action;

        const refId = typeof payload === 'string' ? payload : payload.id;
        const isOpen = typeof payload === 'string' ? false : payload.isOpen;

        const newItem = {
            id: refId,
            isOpen: isOpen,
        };

        if (payload && !state.itemsToOpen.some(item => item.id === refId)) {
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
