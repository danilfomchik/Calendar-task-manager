import {TDayConditions, TOpenMeteoDailyResponse} from './types';

const firstNumber = (values?: (number | null)[]) => {
  const value = values?.[0];

  return typeof value === 'number' && Number.isFinite(value) ? value : null;
};

// "2026-11-11T07:05" (location's local time) -> "07:05"; null/empty on polar day or night
const firstTime = (values?: (string | null)[]) => {
  const match = values?.[0]?.match(/T(\d{2}:\d{2})/);

  return match ? match[1] : null;
};

// First (only) day of an Open-Meteo daily response, or null when the core values are missing or the shape is off
export const parseConditions = (response: unknown): TDayConditions | null => {
  if (!response || typeof response !== 'object') return null;

  const {daily} = response as TOpenMeteoDailyResponse;

  if (!daily) return null;

  const temperatureMax = firstNumber(daily.temperature_2m_max);
  const temperatureMin = firstNumber(daily.temperature_2m_min);
  const weatherCode = firstNumber(daily.weather_code);
  const precipitationSum = firstNumber(daily.precipitation_sum);
  const windSpeedMax = firstNumber(daily.wind_speed_10m_max);

  if (
    temperatureMax === null ||
    temperatureMin === null ||
    weatherCode === null ||
    precipitationSum === null ||
    windSpeedMax === null
  ) {
    return null;
  }

  return {
    temperatureMax,
    temperatureMin,
    weatherCode,
    precipitationSum,
    precipitationProbability: firstNumber(daily.precipitation_probability_max),
    windSpeedMax,
    windDirection: firstNumber(daily.wind_direction_10m_dominant),
    sunrise: firstTime(daily.sunrise),
    sunset: firstTime(daily.sunset),
  };
};
