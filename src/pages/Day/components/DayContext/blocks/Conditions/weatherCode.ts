type TWeatherDescription = {label: string; glyph: string};

// WMO 4677 codes Open-Meteo returns in weather_code (the most severe condition of the day)
const WEATHER_CODES: Record<number, TWeatherDescription> = {
  0: {label: 'Clear sky', glyph: '☀️'},
  1: {label: 'Mainly clear', glyph: '🌤️'},
  2: {label: 'Partly cloudy', glyph: '⛅'},
  3: {label: 'Overcast', glyph: '☁️'},
  45: {label: 'Fog', glyph: '🌫️'},
  48: {label: 'Rime fog', glyph: '🌫️'},
  51: {label: 'Light drizzle', glyph: '🌦️'},
  53: {label: 'Drizzle', glyph: '🌦️'},
  55: {label: 'Dense drizzle', glyph: '🌧️'},
  56: {label: 'Freezing drizzle', glyph: '🌧️'},
  57: {label: 'Freezing drizzle', glyph: '🌧️'},
  61: {label: 'Light rain', glyph: '🌧️'},
  63: {label: 'Rain', glyph: '🌧️'},
  65: {label: 'Heavy rain', glyph: '🌧️'},
  66: {label: 'Freezing rain', glyph: '🌧️'},
  67: {label: 'Freezing rain', glyph: '🌧️'},
  71: {label: 'Light snow', glyph: '🌨️'},
  73: {label: 'Snow', glyph: '🌨️'},
  75: {label: 'Heavy snow', glyph: '❄️'},
  77: {label: 'Snow grains', glyph: '🌨️'},
  80: {label: 'Light showers', glyph: '🌦️'},
  81: {label: 'Showers', glyph: '🌧️'},
  82: {label: 'Violent showers', glyph: '⛈️'},
  85: {label: 'Snow showers', glyph: '🌨️'},
  86: {label: 'Heavy snow showers', glyph: '❄️'},
  95: {label: 'Thunderstorm', glyph: '⛈️'},
  96: {label: 'Thunderstorm, hail', glyph: '⛈️'},
  99: {label: 'Thunderstorm, hail', glyph: '⛈️'},
};

const UNKNOWN: TWeatherDescription = {label: 'Unknown', glyph: '🌡️'};

export const describeWeatherCode = (code: number): TWeatherDescription => WEATHER_CODES[code] ?? UNKNOWN;

// Which Sky scene stands for a WMO code; 'night' is the scene for when there is no weather yet
export type TSkyKind = 'clear' | 'partly' | 'overcast' | 'fog' | 'rain' | 'snow' | 'storm' | 'night';

type TWeatherSkyKind = Exclude<TSkyKind, 'night'>;

const SKY_KIND_CODES: [number[], TWeatherSkyKind][] = [
  [[0, 1], 'clear'],
  [[2], 'partly'],
  [[3], 'overcast'],
  [[45, 48], 'fog'],
  [[51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82], 'rain'],
  [[71, 73, 75, 77, 85, 86], 'snow'],
  [[95, 96, 99], 'storm'],
];

// Flattened to code → kind so a lookup is a single get (array keys can't be looked up by value)
const SKY_KIND_BY_CODE = new Map<number, TWeatherSkyKind>(
  SKY_KIND_CODES.flatMap(([codes, kind]) => codes.map((code): [number, TWeatherSkyKind] => [code, kind])),
);

export const getSkyKind = (code: number): TWeatherSkyKind => SKY_KIND_BY_CODE.get(code) ?? 'overcast';
