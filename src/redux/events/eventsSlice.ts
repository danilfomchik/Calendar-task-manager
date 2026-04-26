import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {StorageKeys} from '@/services/types';
import {getLocalStoredValues} from '@/services/utils';

import {SliceNames} from '../types';
import {TEvent, TEventsById, TEventsState} from './types';

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
  },
  editEvent: (state: TEventsState, action: PayloadAction<{oldEvent: TEvent; newEvent: TEvent}>) => {
    const {oldEvent, newEvent} = action.payload;

    // if event date has changed
    if (oldEvent.date !== newEvent.date) {
      const updatedEventsByDateObj = state.eventsByDate;

      const filteredOldDateEvents = updatedEventsByDateObj[oldEvent.date]?.filter(eId => eId !== newEvent.id);

      // remove from old date
      updatedEventsByDateObj[oldEvent.date] = filteredOldDateEvents;

      // add to new date
      updatedEventsByDateObj[newEvent.date] ??= [];
      updatedEventsByDateObj[newEvent.date]?.push(newEvent.id);

      const {[oldEvent.date]: oldDate, ...rest} = updatedEventsByDateObj;

      // if no more event by old date - remove this date from state
      const resultEventsByDateObj = oldDate?.length ? updatedEventsByDateObj : rest;

      state.eventsByDate = resultEventsByDateObj;
    }

    // update event
    state.eventsById[newEvent.id] = newEvent;
  },
  deleteEvent: (state: TEventsState, action: PayloadAction<TEvent>) => {
    const eventId = action.payload.id;
    const eventsById = state.eventsById;
    const eventToDelete = eventsById[eventId];

    if (!eventToDelete) return;

    const eventsByDate = state.eventsByDate;

    const filteredOldDateEvents = eventsByDate[eventToDelete.date]?.filter(eId => eId !== eventId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {[eventToDelete.id]: _, ...restEventsById} = eventsById;

    state.eventsById = restEventsById;
    state.eventsByDate[eventToDelete.date] =
      filteredOldDateEvents && filteredOldDateEvents.length > 0 ? filteredOldDateEvents : undefined;
  },
  setEventsById: (state: TEventsState, action: PayloadAction<TEventsById>) => {
    state.eventsById = action.payload;
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

export const {addEvent, editEvent, deleteEvent, setEventsById} = eventsSlice.actions;
export default eventsSlice;
