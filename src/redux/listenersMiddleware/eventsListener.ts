import {isAnyOf} from '@reduxjs/toolkit';

import {StorageKeys} from '@/types/types';

import {addEvent, deleteEvent, editEvent} from '../events/eventsSlice';
import {startAppListening} from '../listenerMiddleware';

startAppListening({
  matcher: isAnyOf(addEvent, editEvent, deleteEvent),
  effect: (_, listenerApi) => {
    const state = listenerApi.getState().eventsData;

    localStorage.setItem(StorageKeys.eventsById, JSON.stringify(state.eventsById));
    localStorage.setItem(StorageKeys.eventsByDate, JSON.stringify(state.eventsByDate));
  },
});
