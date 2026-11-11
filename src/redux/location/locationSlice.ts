import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {getLocalStoredValues} from '@/services/utils';
import {StorageKeys} from '@/types/types';

import {SliceNames} from '../types';
import {roundCoordinate, toPersistedGeolocationStatus} from './helpers';
import {TGeolocationStatus, TLocation, TLocationState} from './types';

const GEOLOCATION_TIMEOUT_MS = 15_000;

const getInitialState = (): TLocationState => {
  try {
    const stored = getLocalStoredValues(StorageKeys.conditionsLocation, null) as Partial<TLocationState> | null;

    return {
      location: stored?.location ?? null,
      geolocationStatus: toPersistedGeolocationStatus(stored?.geolocationStatus),
    };
  } catch {
    return {location: null, geolocationStatus: 'idle'};
  }
};

type TLocationThunkState = {[SliceNames.locationSlice]: TLocationState};

// Asks the browser for the device position, once: the condition skips it while a location is known,
// a request is in flight, or the user has already answered.
export const requestDeviceLocation = createAsyncThunk<
  TLocation,
  void,
  {state: TLocationThunkState; rejectValue: TGeolocationStatus}
>(
  'location/requestDeviceLocation',
  async (_, {rejectWithValue}) => {
    if (!('geolocation' in navigator)) return rejectWithValue('unavailable');

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
      const isDenied = (error as GeolocationPositionError).code === 1; // PERMISSION_DENIED

      return rejectWithValue(isDenied ? 'denied' : 'unavailable');
    }
  },
  {
    condition: (_, {getState}) => {
      const {location, geolocationStatus} = getState()[SliceNames.locationSlice];

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
      })
      .addCase(requestDeviceLocation.fulfilled, (state, action) => {
        state.geolocationStatus = 'granted';
        // A city picked while the prompt was open wins
        state.location ??= action.payload;
      })
      .addCase(requestDeviceLocation.rejected, (state, action) => {
        state.geolocationStatus = action.payload ?? 'unavailable';
      });
  },
});

export const {setLocation} = locationSlice.actions;
export default locationSlice;
