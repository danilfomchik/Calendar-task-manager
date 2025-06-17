import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {StorageKeys} from '@/services/types';
import {getLocalStoredValues} from '@/services/utils';

import {SliceNames} from '../types';
import {TEvent, TEventsState} from './types';

const reducers = {
    addEvent: (state: TEventsState, action: PayloadAction<TEvent>) => {
        const {date} = action.payload;
        const events = state.events || {};

        const updatedEvents = {
            ...events,
            [date]: [...(events[date] || []), action.payload],
        };

        state.events = updatedEvents;
        localStorage.setItem(StorageKeys.events, JSON.stringify(updatedEvents));
    },
};

const initialEvents = getLocalStoredValues(StorageKeys.events, null);

const initialState: TEventsState = {
    events: initialEvents,
};

const eventsSlice = createSlice({
    name: SliceNames.eventsSlice,
    initialState,
    reducers,
});

export const {addEvent} = eventsSlice.actions;
export default eventsSlice;
