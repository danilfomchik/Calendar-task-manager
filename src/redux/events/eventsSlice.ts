import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {StorageKeys} from '@/services/types';
import {getLocalStoredValues} from '@/services/utils';

import {SliceNames} from '../types';
import {TEvent, TEventsState} from './types';

const reducers = {
  addEvent: (state: TEventsState, action: PayloadAction<TEvent>) => {
    const event = action.payload;
    const eventsByDate = state.eventsByDate;

    const updatedEventsByDate = {
      ...eventsByDate,
      [event.date]: [...(eventsByDate[event.date] || []), event.id],
    };

    state.eventsById[event.id] = event;
    state.eventsByDate = updatedEventsByDate;

    localStorage.setItem(StorageKeys.eventsById, JSON.stringify(state.eventsById));
    localStorage.setItem(StorageKeys.eventsByDate, JSON.stringify(updatedEventsByDate));
  },
  editEvent: (state: TEventsState, action: PayloadAction<TEvent>) => {
    // updated event value
    const updatedEvent = action.payload;
    // prev event value
    const oldEvent = state.eventsById[updatedEvent.id];

    // if event date has changed
    if (oldEvent.date !== updatedEvent.date) {
      const updatedEventsByDateObj = state.eventsByDate;

      const filteredOldDateEvents = updatedEventsByDateObj[oldEvent.date]?.filter(eId => eId !== updatedEvent.id);

      // remove from old date
      updatedEventsByDateObj[oldEvent.date] = filteredOldDateEvents;

      // add to new date
      updatedEventsByDateObj[updatedEvent.date] ??= [];
      updatedEventsByDateObj[updatedEvent.date]?.push(updatedEvent.id);

      const {[oldEvent.date]: oldDate, ...rest} = updatedEventsByDateObj;

      // if no more event by old date - remove this date from state
      const resultEventsByDateObj = oldDate?.length ? updatedEventsByDateObj : rest;

      state.eventsByDate = resultEventsByDateObj;
      localStorage.setItem(StorageKeys.eventsByDate, JSON.stringify(resultEventsByDateObj));
    }

    // update event
    state.eventsById[updatedEvent.id] = updatedEvent;
    localStorage.setItem(StorageKeys.eventsById, JSON.stringify(state.eventsById));
  },
};

const initialEventsById = getLocalStoredValues(StorageKeys.eventsById, {});
const initialEventsByDate = getLocalStoredValues(StorageKeys.eventsByDate, {});

const initialState: TEventsState = {
  eventsById: initialEventsById,
  eventsByDate: initialEventsByDate,
};

const eventsSlice = createSlice({
  name: SliceNames.eventsSlice,
  initialState,
  reducers,
});

export const {addEvent, editEvent} = eventsSlice.actions;
export default eventsSlice;
