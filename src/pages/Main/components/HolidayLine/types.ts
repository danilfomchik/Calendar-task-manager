import {TAIInsights} from '@/redux/dateHolidaysGenerator/parseAIContent';

export type THolidayLineProps = {
  // The selected date; changing it closes the popover
  date: string;
  className?: string;
};

export type THolidayLineState = {
  // AI insights flag; when false render nothing and reserve no space
  isEnabled: boolean;
  // Debouncing the selected date or fetching its answer
  isLoading: boolean;
  // Parsed answer for exactly the selected date; null when none, failed or malformed
  insights: TAIInsights | null;
  name: string | null;
};
