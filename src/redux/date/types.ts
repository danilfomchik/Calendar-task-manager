import {Nullable} from '@/types/types';

type TMonth = Nullable<string>;
type TYear = Nullable<string>;
type TDay = Nullable<string>;

type TDate = {
  fullDate: string;
  month: TMonth;
  year: TYear;
  day: TDay;
  selectedDate: string;
  isCollapsed: boolean;
  weekStart: string;
};

export type TDateState = TDate;
