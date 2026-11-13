const SYNODIC_MONTH_DAYS = 29.530588853;
// A reference new moon: 2000-01-06 18:14 UTC
const REFERENCE_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14);
const DAY_MS = 86_400_000;
// A principal phase (new, quarters, full) is an instant; name the day after it when it is within a day of noon
const PRINCIPAL_TOLERANCE = 1 / SYNODIC_MONTH_DAYS;

export type TMoonPhase = {
  fraction: number; // 0 new, 0.25 first quarter, 0.5 full, 0.75 last quarter (as Open-Meteo's moon_phase)
  name: string;
};

const PRINCIPAL_PHASES = [
  {at: 0, name: 'New moon'},
  {at: 0.25, name: 'First quarter'},
  {at: 0.5, name: 'Full moon'},
  {at: 0.75, name: 'Last quarter'},
  {at: 1, name: 'New moon'},
];

const INTERMEDIATE_PHASES = [
  {name: 'Waxing crescent'},
  {name: 'Waxing gibbous'},
  {name: 'Waning gibbous'},
  {name: 'Waning crescent'},
];

// Moon phase at noon UTC of a YYYY-MM-DD day, from the mean synodic month (good to well under a day,
// which is all a daily label needs). Open-Meteo's archive API has no moon variable, so it is computed here for every day.
export const getMoonPhase = (date: string): TMoonPhase => {
  const [year, month, day] = date.split('-').map(Number);
  const noonMs = Date.UTC(year, month - 1, day, 12);
  const lunations = (noonMs - REFERENCE_NEW_MOON_MS) / DAY_MS / SYNODIC_MONTH_DAYS;
  const fraction = lunations - Math.floor(lunations);

  const principal = PRINCIPAL_PHASES.find(phase => Math.abs(fraction - phase.at) <= PRINCIPAL_TOLERANCE);
  const {name} = principal ?? INTERMEDIATE_PHASES[Math.floor(fraction * 4)];

  return {fraction, name};
};
