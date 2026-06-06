import {isAnyOf} from '@reduxjs/toolkit';

import {StorageKeys} from '@/types/types';

import {addEvent, deleteEvent, editEvent} from '../events/eventsSlice';
import {TEventsById} from '../events/types';
import {startAppListening} from '../listenerMiddleware';

const resetEventsByIdDisable = (events: TEventsById) => {
  const eventsByIdEntries = Object.entries(events);

  const updatedEventsByIdEntries = eventsByIdEntries.map(([id, event]) => [
    id,
    {
      ...event,
      isDisabled: false,
    },
  ]);

  return Object.fromEntries(updatedEventsByIdEntries);
};

startAppListening({
  matcher: isAnyOf(addEvent, editEvent, deleteEvent),
  effect: (_, listenerApi) => {
    const state = listenerApi.getState().eventsData;

    localStorage.setItem(StorageKeys.eventsById, JSON.stringify(resetEventsByIdDisable(state.eventsById)));
    localStorage.setItem(StorageKeys.eventsByDate, JSON.stringify(state.eventsByDate));
  },
});
