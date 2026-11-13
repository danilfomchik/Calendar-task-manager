import {TReverseGeocodeResponse} from './types';

// Reverse-geocode response -> the name shown for the device position: the city, else the locality or region.
// null when the answer has nothing usable (open sea, malformed body): the card then shows no name.
export const parsePlaceName = (response: unknown): string | null => {
  if (!response || typeof response !== 'object') return null;

  const {city, locality, principalSubdivision, countryName} = response as TReverseGeocodeResponse;
  const name = [city, locality, principalSubdivision].find(part => typeof part === 'string' && part.trim());

  if (!name) return null;

  return countryName && countryName !== name ? `${name}, ${countryName}` : name;
};
