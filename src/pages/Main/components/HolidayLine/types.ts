import {TAIInsights} from '@/redux/dateHolidaysGenerator/parseAIContent';

export type THolidayLineProps = {
  // The selected date; changing it closes the popover
  date: string;
  className?: string;
};

// What the Holiday line row shows: a skeleton while the date settles and loads, the error row with Retry when the
// request failed, the holiday chip when the answer names one, and nothing otherwise
export type THolidayLineStatus = 'loading' | 'error' | 'holiday' | 'none';

type THolidayLineBase = {
  // AI insights flag; when false render nothing and reserve no space
  isEnabled: boolean;
  // Refetches the selected date's answer (the error row's Retry); only call it once the date has settled
  retry: () => void;
};

// Parsed answer for exactly the selected date; insights and name are set exactly when status is 'holiday'
export type THolidayLineState = THolidayLineBase &
  (
    | {status: 'holiday'; insights: TAIInsights; name: string}
    | {status: Exclude<THolidayLineStatus, 'holiday'>; insights: null; name: null}
  );
