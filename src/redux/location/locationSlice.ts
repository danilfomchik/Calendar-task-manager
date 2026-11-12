import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {getLocalStoredValues} from '@/services/utils';
import {StorageKeys} from '@/types/types';

import {SliceNames} from '../types';
import {roundCoordinate, toGeolocationFailure, toPersistedGeolocationStatus} from './helpers';
import {TGeolocationFailure, TLocation, TLocationState} from './types';

const GEOLOCATION_TIMEOUT_MS = 15_000;

const getInitialState = (): TLocationState => {
  try {
    const stored = getLocalStoredValues(StorageKeys.conditionsLocation, null) as Partial<TLocationState> | null;

    return {
      location: stored?.location ?? null,
      geolocationStatus: toPersistedGeolocationStatus(stored?.geolocationStatus),
      geolocationFailure: null,
    };
  } catch {
    return {location: null, geolocationStatus: 'idle', geolocationFailure: null};
  }
};

type TLocationThunkState = {[SliceNames.locationSlice]: TLocationState};

type TRejection = {status: 'denied' | 'unavailable'; failure: TGeolocationFailure};

// Asks the browser for the device position. Without `force` it runs once: the condition skips it while a location
// is known, a request is in flight, or the user has already answered. `force` is the user asking again
// ("Use my location"): it runs unless a request is in flight, and its result replaces a searched city.
export const requestDeviceLocation = createAsyncThunk<
  TLocation,
  {force?: boolean} | void,
  {state: TLocationThunkState; rejectValue: TRejection}
>(
  'location/requestDeviceLocation',
  async (_, {rejectWithValue}) => {
    if (!('geolocation' in navigator)) return rejectWithValue({status: 'unavailable', failure: 'unsupported'});

    try {
      const {coords} = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: GEOLOCATION_TIMEOUT_MS,
          maximumAge: Infinity,
        }),
      );

      return {
        // Rounded to ~1 km before it is stored or sent anywhere (see docs/adr/0001)
        latitude: roundCoordinate(coords.latitude),
        longitude: roundCoordinate(coords.longitude),
        name: null,
        source: 'device',
      };
    } catch (error) {
      const failure = toGeolocationFailure((error as GeolocationPositionError).code);

      return rejectWithValue({status: failure === 'denied' ? 'denied' : 'unavailable', failure});
    }
  },
  {
    condition: (arg, {getState}) => {
      const {location, geolocationStatus} = getState()[SliceNames.locationSlice];

      if (arg?.force) return geolocationStatus !== 'pending';

      return !location && geolocationStatus === 'idle';
    },
  },
);

const locationSlice = createSlice({
  name: SliceNames.locationSlice,
  initialState: getInitialState,
  reducers: {
    // A location chosen by the user (city search, #76); replaces the device position
    setLocation: (state, action: PayloadAction<TLocation>) => {
      state.location = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(requestDeviceLocation.pending, state => {
        state.geolocationStatus = 'pending';
        state.geolocationFailure = null;
      })
      .addCase(requestDeviceLocation.fulfilled, (state, action) => {
        state.geolocationStatus = 'granted';

        // A city picked while the first prompt was open wins; a position the user asked for again replaces it
        if (action.meta.arg?.force) state.location = action.payload;
        else state.location ??= action.payload;
      })
      .addCase(requestDeviceLocation.rejected, (state, action) => {
        state.geolocationStatus = action.payload?.status ?? 'unavailable';
        state.geolocationFailure = action.payload?.failure ?? 'no-fix';
      });
  },
});

export const {setLocation} = locationSlice.actions;
export default locationSlice;
