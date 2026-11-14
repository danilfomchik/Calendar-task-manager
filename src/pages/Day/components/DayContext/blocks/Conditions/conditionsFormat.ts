import {TDayConditions} from '@/redux/conditions/types';

import {getSkyKind} from './weatherCode';
import {formatWindDirection} from './wind';

export const formatTemperature = (value: number) => `${Math.round(value)}°`;

export const isSnow = (code: number) => getSkyKind(code) === 'snow';

const formatMillimetres = (value: number) => `${Math.round(value * 10) / 10} mm`;

const isDry = ({precipitationSum, precipitationProbability}: TDayConditions) =>
  precipitationSum < 0.1 && (precipitationProbability === null || precipitationProbability < 20);

// "None expected", or "92%, 14.6 mm" (just the amount on days with no forecast probability)
export const formatRain = (data: TDayConditions) => {
  if (isDry(data)) return 'None expected';

  const amount = formatMillimetres(data.precipitationSum);

  return data.precipitationProbability === null ? amount : `${data.precipitationProbability}%, ${amount}`;
};

export const formatWind = ({windDirection, windSpeedMax}: TDayConditions) =>
  `${formatWindDirection(windDirection) ?? 'Variable'}, ${Math.round(windSpeedMax)} km/h`;

// "HH:mm" -> minutes since midnight
const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);

  return hours * 60 + minutes;
};

// "9 h 26 min", or "None today" on polar days
export const formatDaylight = ({sunrise, sunset}: TDayConditions) => {
  if (!sunrise || !sunset) return 'None today';

  const total = toMinutes(sunset) - toMinutes(sunrise);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
};

// "50.45° N" and "30.52° E", to tell same-name cities apart
export const formatCoordinates = (latitude: number, longitude: number) => ({
  latitude: `${Math.abs(latitude).toFixed(2)}° ${latitude >= 0 ? 'N' : 'S'}`,
  longitude: `${Math.abs(longitude).toFixed(2)}° ${longitude >= 0 ? 'E' : 'W'}`,
});
