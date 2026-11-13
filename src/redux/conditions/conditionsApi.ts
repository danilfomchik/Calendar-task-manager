import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import {parseConditions} from './parseConditions';
import {parsePlaceName} from './parsePlaceName';
import {parsePlaces} from './parsePlaces';
import {TConditionsQueryArgs, TConditionsSource, TDayConditions, TPlace, TPlaceNameQueryArgs} from './types';

// Open-Meteo: free, no API key, CORS-enabled (see docs/adr/0001-open-meteo-for-day-conditions.md)
const ENDPOINTS: Record<TConditionsSource, string> = {
  forecast: 'https://api.open-meteo.com/v1/forecast',
  archive: 'https://archive-api.open-meteo.com/v1/archive',
};

// City search for the location fallback (#76). Only the typed text is sent, never a position.
const GEOCODING_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search';
const PLACE_RESULTS = 5;

// Name for the device position (BigDataCloud, free, no key, CORS). Only the position rounded to ~1 km is sent.
const REVERSE_GEOCODING_ENDPOINT = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

const COMMON_DAILY = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'wind_speed_10m_max',
  'wind_direction_10m_dominant',
  'sunrise',
  'sunset',
];

// Precipitation probability only exists for forecasts
const DAILY: Record<TConditionsSource, string> = {
  forecast: [...COMMON_DAILY, 'precipitation_probability_max'].join(','),
  archive: COMMON_DAILY.join(','),
};

export const conditionsApi = createApi({
  reducerPath: 'conditionsApi',
  baseQuery: fetchBaseQuery({timeout: 20_000}),
  endpoints: builder => ({
    // One day of weather + sunrise/sunset for a location. null data = unusable answer (render nothing)
    getDayConditions: builder.query<TDayConditions | null, TConditionsQueryArgs>({
      query: ({date, latitude, longitude, source}) => ({
        url: ENDPOINTS[source],
        params: {
          latitude,
          longitude,
          start_date: date,
          end_date: date,
          daily: DAILY[source],
          timezone: 'auto', // sunrise/sunset and the day boundary in the location's own time zone
        },
      }),
      transformResponse: parseConditions,
      keepUnusedDataFor: 3600,
    }),
    // Places matching a typed city name (2+ characters: 2 match exactly, 3+ by prefix). [] = no match
    searchPlaces: builder.query<TPlace[], string>({
      query: name => ({
        url: GEOCODING_ENDPOINT,
        params: {name, count: PLACE_RESULTS, language: 'en', format: 'json'},
      }),
      transformResponse: parsePlaces,
    }),
    // The city a (rounded) position is in, to label the device location. null = no usable name
    getPlaceName: builder.query<string | null, TPlaceNameQueryArgs>({
      query: ({latitude, longitude}) => ({
        url: REVERSE_GEOCODING_ENDPOINT,
        params: {latitude, longitude, localityLanguage: 'en'},
      }),
      transformResponse: parsePlaceName,
      keepUnusedDataFor: 86_400,
    }),
  }),
});

export const {useGetDayConditionsQuery, useSearchPlacesQuery, useGetPlaceNameQuery} = conditionsApi;
