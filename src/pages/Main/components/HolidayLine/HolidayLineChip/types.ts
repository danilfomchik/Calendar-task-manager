import {ButtonHTMLAttributes, Ref} from 'react';

import {THolidayLineStatus} from '@/pages/Main/components/HolidayLine/types';

// Extra button attributes (onClick, aria-expanded, aria-haspopup, aria-controls...) are passed to the chip so a
// caller can turn it into a popover trigger; the ref is forwarded to the same button
export type THolidayLineChipProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className' | 'type' | 'name'
> & {
  status: THolidayLineStatus;
  // Called by the error row's Retry button
  onRetry: () => void;
  // Swaps the error row's warning mark for a spinner and disables Retry
  isRetrying?: boolean;
  // The holiday's name, shown when status is 'holiday'
  name: string | null;
  // Where the holiday is observed (a country or "Worldwide"), shown in the chip's AI label; null when unknown
  region?: string | null;
  className?: string;
  // The always-mounted row around the chip; a popover returns focus here when the chip itself has gone
  slotRef?: Ref<HTMLDivElement>;
};
