export type Nullable<T> = T | null;
export type NonNullable<T> = T extends null | undefined ? never : T;

export type TScreenSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '';

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

export enum CalendarsNames {
  work = 'Work',
  personal = 'Personal',
  health = 'Health',
  holidays = 'Holidays',
}

export type TCalendarsList = {
  name: CalendarsNames;
  itemColor: string;
}[];
