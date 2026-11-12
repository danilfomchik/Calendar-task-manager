import {isAnyOf} from '@reduxjs/toolkit';

import {StorageKeys} from '@/types/types';

import {startAppListening} from '../listenerMiddleware';
import {toPersistedGeolocationStatus} from '../location/helpers';
import {requestDeviceLocation, setLocation} from '../location/locationSlice';
import {TLocationState} from '../location/types';

// Persists the location and the user's geolocation answer, so the browser is asked once, not per visit.
startAppListening({
  matcher: isAnyOf(setLocation, requestDeviceLocation.fulfilled, requestDeviceLocation.rejected),
  effect: (_, listenerApi) => {
    const {location, geolocationStatus} = listenerApi.getState().locationData;
    const stored: Pick<TLocationState, 'location' | 'geolocationStatus'> = {
      location,
      geolocationStatus: toPersistedGeolocationStatus(geolocationStatus),
    };

    localStorage.setItem(StorageKeys.conditionsLocation, JSON.stringify(stored));
  },
});
