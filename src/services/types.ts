export type Nullable<T> = T | null;
export type NonNullable<T> = T extends null | undefined ? never : T;

export type Format = 'YYYY-MM-DD' | 'YYYY' | 'MMMM' | 'M' | 'DD';

export enum MonthParts {
  START = 'start',
  END = 'end',
}

export enum StorageKeys {
  eventsById = 'eventsById',
  eventsByDate = 'eventsByDate',
}

export enum RouterPaths {
  home = '/',
  day = '/day/:date',
  notFound = '*',
}
