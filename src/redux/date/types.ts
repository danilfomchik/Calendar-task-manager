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
  // Home's Month grid has been shown in this session (in memory: a reload counts as a direct load). The Day page's
  // "Back to month" returns to the month Home showed when set, else to the Viewed day's month.
  hasShownMonthGrid: boolean;
  // bumped by every Today action so the sidebar mini-calendar can drop its own month browsing
  todayRequests: number;
};

export type TDateState = TDate;
