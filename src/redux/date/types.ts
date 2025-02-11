import {PayloadAction} from '@reduxjs/toolkit';

import {Nullable} from '@/services/types';

type TMonth = Nullable<string>;
type TYear = Nullable<string>;
type TDay = Nullable<string>;

type TDate = {
    fullDate: string;
    month: TMonth;
    year: TYear;
    day: TDay;
};

export type TDateState = TDate;

export type TSetFullDateAction = PayloadAction<string>;
