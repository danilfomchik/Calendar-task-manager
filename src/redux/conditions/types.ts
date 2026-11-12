// forecast: api.open-meteo.com (92 days back .. 15 ahead); archive: archive-api.open-meteo.com (1940 .. ~5 days ago)
export type TConditionsSource = 'forecast' | 'archive';

export type TConditionsQueryArgs = {
  date: string; // YYYY-MM-DD
  latitude: number;
  longitude: number;
  source: TConditionsSource;
};

// One day of Open-Meteo daily data, in the location's own time zone
export type TDayConditions = {
  temperatureMax: number; // °C
  temperatureMin: number; // °C
  weatherCode: number; // WMO code
  precipitationSum: number; // mm
  precipitationProbability: number | null; // %, forecast only
  windSpeedMax: number; // km/h
  windDirection: number | null; // degrees, where the wind comes from
  sunrise: string | null; // local "HH:mm", null on polar day/night
  sunset: string | null;
};

// Raw response shape (only what we read), every value nullable as Open-Meteo returns null for missing data
export type TOpenMeteoDailyResponse = {
  daily?: {
    time?: string[];
    temperature_2m_max?: (number | null)[];
    temperature_2m_min?: (number | null)[];
    weather_code?: (number | null)[];
    precipitation_sum?: (number | null)[];
    precipitation_probability_max?: (number | null)[];
    wind_speed_10m_max?: (number | null)[];
    wind_direction_10m_dominant?: (number | null)[];
    sunrise?: (string | null)[];
    sunset?: (string | null)[];
  };
};

// A place from Open-Meteo geocoding, ready to become the Conditions location
export type TPlace = {
  id: number;
  name: string; // "Springfield"
  region: string; // "Missouri, United States", or "" when there is nothing to add
  latitude: number; // rounded to 2 dp, like the device position
  longitude: number;
};

// Raw geocoding row (only what we read). `results` is absent when nothing matches.
export type TOpenMeteoGeocodingResponse = {
  results?: {
    id?: number;
    name?: string;
    latitude?: number;
    longitude?: number;
    country?: string;
    admin1?: string;
  }[];
};
