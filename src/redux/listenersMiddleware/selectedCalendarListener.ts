import {StorageKeys} from '@/services/types';
import {getLocalStoredValues} from '@/services/utils';

import {setEventsById} from '../events/eventsSlice';
import {TEventsById} from '../events/types';
import {startAppListening} from '../listenerMiddleware';
import {setSelectedCalendar} from '../myCalendars/myCalendarsSlice';

// adds a listener for the setSelectedCalendar action
// when the selected calendar changes, we update the events list, disabling events that do not belong to the selected calendar
startAppListening({
  actionCreator: setSelectedCalendar,
  effect: (action, listenerApi) => {
    const selectedCalendar = action.payload;

    // initial events from localstorage
    const eventsById: TEventsById = getLocalStoredValues(StorageKeys.eventsById, {});
    const eventsByIdEntries = Object.entries(eventsById);

    const updatedEventsByIdEntries = eventsByIdEntries.map(([id, event]) => {
      return [
        id,
        {
          ...event,
          isDisabled: !selectedCalendar ? eventsById[id].isDisabled : selectedCalendar !== event.eventCalendar,
        },
      ];
    });

    const updatedEventsById = Object.fromEntries(updatedEventsByIdEntries);

    listenerApi.dispatch(setEventsById(updatedEventsById));
  },
});
