import {TGeolocationStatus} from './types';

// Two decimals is ~1.1 km of latitude: enough for a daily forecast, and it is all that leaves the browser
export const roundCoordinate = (value: number) => Math.round(value * 100) / 100;

// The geolocation status as it is persisted and hydrated: only the user's answer (granted / denied) survives a
// session. "pending" and "unavailable" never prompted the user (or were cut short), so they become "idle" and a
// later session may ask again.
export const toPersistedGeolocationStatus = (status: unknown): TGeolocationStatus =>
  status === 'granted' || status === 'denied' ? status : 'idle';
