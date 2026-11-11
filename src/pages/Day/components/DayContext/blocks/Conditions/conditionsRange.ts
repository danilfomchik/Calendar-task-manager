import moment from 'moment';

import {TConditionsSource} from '@/redux/conditions/types';
import {DATE_KEY_FORMAT} from '@/services/dateUtils';

// Open-Meteo's forecast API accepts start_date from 92 days back (past_days max) to 15 days ahead (forecast_days max 16).
// Older days come from the archive API (ERA5 reanalysis, from 1940). Later days have no data.
export const FORECAST_DAYS_AHEAD = 15;
export const FORECAST_DAYS_BACK = 92;
export const ARCHIVE_FIRST_DATE = '1940-01-01';

// Which Open-Meteo endpoint covers the Viewed day, or null when none does (the card is hidden)
export const getConditionsSource = (date: string, today: string): TConditionsSource | null => {
  const day = moment(date, DATE_KEY_FORMAT, true);
  const todayDay = moment(today, DATE_KEY_FORMAT, true);

  if (!day.isValid() || !todayDay.isValid()) return null;

  const diff = day.diff(todayDay, 'days');

  if (diff > FORECAST_DAYS_AHEAD) return null;
  if (diff >= -FORECAST_DAYS_BACK) return 'forecast';
  if (date >= ARCHIVE_FIRST_DATE) return 'archive';

  return null;
};
