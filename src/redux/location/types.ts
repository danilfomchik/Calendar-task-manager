// Where Conditions are looked up. device: browser geolocation; city: picked by the user (#76 city search);
// timezone: the Approximate location near the browser's time zone (derived, never stored)
export type TLocationSource = 'device' | 'city' | 'timezone';

export type TLocation = {
  latitude: number;
  longitude: number;
  name: string | null; // city name for a picked city or an approximate one, null for the device position
  source: TLocationSource;
};

// idle: never asked; pending: browser prompt / lookup in flight; denied: user refused (persisted, never re-asked
// unless the user asks again); unavailable: no geolocation API, timeout or no fix (not persisted, so a later session
// may try again)
export type TGeolocationStatus = 'idle' | 'pending' | 'granted' | 'denied' | 'unavailable';

// Why the last device position request failed, so the UI can say it (session only). refused: the browser says the
// site is allowed yet still would not give a position (seen in desktop Chrome)
export type TGeolocationFailure = 'denied' | 'refused' | 'no-fix' | 'timeout' | 'unsupported';

export type TLocationState = {
  location: TLocation | null;
  geolocationStatus: TGeolocationStatus;
  geolocationFailure: TGeolocationFailure | null;
  // The answer held before the request in flight, so a failed retry (timeout, no fix) can keep it (session only)
  answerBeforeRequest: TGeolocationStatus | null;
};
