import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import {parseConditions} from './parseConditions';
import {TConditionsQueryArgs, TConditionsSource, TDayConditions} from './types';

// Open-Meteo: free, no API key, CORS-enabled (see docs/adr/0001-open-meteo-for-day-conditions.md)
const ENDPOINTS: Record<TConditionsSource, string> = {
  forecast: 'https://api.open-meteo.com/v1/forecast',
  archive: 'https://archive-api.open-meteo.com/v1/archive',
};

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
  }),
});

export const {useGetDayConditionsQuery} = conditionsApi;
