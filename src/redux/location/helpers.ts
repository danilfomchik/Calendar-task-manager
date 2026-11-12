import {TIME_ZONE_ALIASES, TIME_ZONE_COORDINATES} from './timeZones';
import {TGeolocationFailure, TGeolocationStatus, TLocation} from './types';

// Two decimals is ~1.1 km of latitude: enough for a daily forecast, and it is all that leaves the browser
export const roundCoordinate = (value: number) => Math.round(value * 100) / 100;

// The geolocation status as it is persisted and hydrated: only the user's answer (granted / denied) survives a
// session. "pending" and "unavailable" never prompted the user (or were cut short), so they become "idle" and a
// later session may ask again.
export const toPersistedGeolocationStatus = (status: unknown): TGeolocationStatus =>
  status === 'granted' || status === 'denied' ? status : 'idle';

// The failure behind a GeolocationPositionError code (1 denied, 2 no fix, 3 timeout)
export const toGeolocationFailure = (code: number | undefined): TGeolocationFailure => {
  if (code === 1) return 'denied';
  if (code === 3) return 'timeout';

  return 'no-fix';
};

// The Approximate location: the reference city of the browser's time zone, or null when the zone is unknown
export const getApproximateLocation = (
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
): TLocation | null => {
  const zone = TIME_ZONE_ALIASES[timeZone] ?? timeZone;
  const coordinates = TIME_ZONE_COORDINATES[zone];

  if (!coordinates) return null;

  return {
    latitude: coordinates[0],
    longitude: coordinates[1],
    name: zone.split('/').pop()?.replace(/_/g, ' ') ?? null,
    source: 'timezone',
  };
};
