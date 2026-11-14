import {ButtonHTMLAttributes} from 'react';

import {TAIInsights} from '@/redux/dateHolidaysGenerator/parseAIContent';

// Extra button attributes (onClick, aria-expanded, aria-haspopup, aria-controls...) are passed to the chip so a
// caller can turn it into a popover trigger; the ref is forwarded to the same button
export type THolidayLineProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className' | 'type' | 'name'
> & {
  isLoading: boolean;
  name: string | null;
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
