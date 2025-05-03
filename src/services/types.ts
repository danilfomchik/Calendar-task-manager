export type Nullable<T> = T | null;
export type NonNullable<T> = T extends null | undefined ? never : T;

export type Format = 'YYYY-MM-DD' | 'YYYY' | 'MMMM' | 'M' | 'DD';

export enum Months {
    Jan = 'January',
    Feb = 'February',
    Mar = 'March',
    Apr = 'April',
    May = 'May',
    Jun = 'June',
    Jul = 'July',
    Aug = 'August',
    Sep = 'September',
    Oct = 'October',
    Nov = 'November',
    Dec = 'December',
}

export enum MonthParts {
    START = 'start',
    END = 'end',
}
