import {isAnyOf} from '@reduxjs/toolkit';

import {StorageKeys} from '@/types/types';

import {startAppListening} from '../listenerMiddleware';
import {requestDeviceLocation, setLocation} from '../location/locationSlice';
import {TLocationState} from '../location/types';

// Persists the location and the user's geolocation answer, so the browser is asked once, not per visit.
// "unavailable" is stored as "idle" so a later session can try again (it never prompted the user).
startAppListening({
  matcher: isAnyOf(setLocation, requestDeviceLocation.fulfilled, requestDeviceLocation.rejected),
  effect: (_, listenerApi) => {
    const {location, geolocationStatus} = listenerApi.getState().locationData;
    const stored: TLocationState = {
      location,
      geolocationStatus: geolocationStatus === 'granted' || geolocationStatus === 'denied' ? geolocationStatus : 'idle',
    };

    localStorage.setItem(StorageKeys.conditionsLocation, JSON.stringify(stored));
  },
});
