// Where Conditions are looked up. device: browser geolocation; city: picked by the user (#76 city search)
export type TLocationSource = 'device' | 'city';

export type TLocation = {
  latitude: number;
  longitude: number;
  name: string | null; // city name for a picked city, null for the device position
  source: TLocationSource;
};

// idle: never asked; pending: browser prompt / lookup in flight; denied: user refused (persisted, never re-asked);
// unavailable: no geolocation API, timeout or no fix (not persisted, so a later session may try again)
export type TGeolocationStatus = 'idle' | 'pending' | 'granted' | 'denied' | 'unavailable';

export type TLocationState = {
  location: TLocation | null;
  geolocationStatus: TGeolocationStatus;
};
