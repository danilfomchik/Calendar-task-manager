// PROTOTYPE, throwaway. Fixed mock data; nothing here touches Redux, Open-Meteo or Groq.
export const MOCK_EVENTS = [
  {id: '1', title: 'Quarterly planning', calendar: 'Work', color: '#4a6cf7', note: 'Room 4B'},
  {id: '2', title: 'Dentist', calendar: 'Health', color: '#34d399', note: ''},
  {id: '3', title: "Mia's birthday dinner", calendar: 'Personal', color: '#a855f7', note: 'Book a table'},
  {id: '4', title: 'Ship release notes', calendar: 'Work', color: '#4a6cf7', note: ''},
  {id: '5', title: 'Remembrance Day', calendar: 'Holidays', color: '#f59e0b', note: ''},
];

export const MOCK_SUMMARY = [
  {calendar: 'Work', color: '#4a6cf7', count: 2},
  {calendar: 'Personal', color: '#a855f7', count: 1},
  {calendar: 'Health', color: '#34d399', count: 1},
  {calendar: 'Holidays', color: '#f59e0b', count: 1},
];

export const MOCK_CONDITIONS = {
  range: '4° / 11°',
  summary: 'Light rain',
  precip: '60%',
  wind: '18 km/h W',
  sunrise: '07:12',
  sunset: '16:21',
  moon: 'Waxing crescent',
};

export const MOCK_UPCOMING = [
  {date: 'Thu 12 Nov', count: 2, first: 'Standup moved'},
  {date: 'Mon 16 Nov', count: 1, first: 'Passport renewal'},
  {date: 'Fri 20 Nov', count: 3, first: 'Team offsite'},
];

export const MOCK_NEIGHBOURS = {
  prev: {day: '10', label: 'Tue 10 Nov', count: 1},
  next: {day: '12', label: 'Thu 12 Nov', count: 2},
};

export const MOCK_AI = {
  holiday: 'Remembrance Day marks the armistice that ended fighting in World War I on 11 November 1918.',
  fact: 'Poppies became its symbol after they bloomed across battlefields in Flanders.',
};

// Mock event mix per weekday (Mon..Sun) for variant E's week strip; the current day uses MOCK_EVENTS.
const [W, P, H] = ['#4a6cf7', '#a855f7', '#34d399'];
export const WEEK_MIX: string[][] = [[W, W, H], [P], [], [W, W], [W, H, P, W], [], [P, P]];
