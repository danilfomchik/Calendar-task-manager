export type TIconsSizes = `size-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`;

export type Nullable<T> = T | null;
export type NonNullable<T> = T extends null | undefined ? never : T;
