import {roundCoordinate} from '../location/helpers';
import {TOpenMeteoGeocodingResponse, TPlace} from './types';

const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

// Open-Meteo geocoding response -> usable places. Missing `results` (no match) or a malformed body is an empty list.
export const parsePlaces = (response: unknown): TPlace[] => {
  if (!response || typeof response !== 'object') return [];

  const {results} = response as TOpenMeteoGeocodingResponse;

  if (!Array.isArray(results)) return [];

  return results.flatMap(({id, name, latitude, longitude, admin1, country}) => {
    if (!isFiniteNumber(id) || !name || !isFiniteNumber(latitude) || !isFiniteNumber(longitude)) return [];

    // "Missouri, United States"; parts that repeat the name (Singapore, Singapore) add nothing
    const region = [...new Set([admin1, country])].filter(part => part && part !== name).join(', ');

    return [{id, name, region, latitude: roundCoordinate(latitude), longitude: roundCoordinate(longitude)}];
  });
};
