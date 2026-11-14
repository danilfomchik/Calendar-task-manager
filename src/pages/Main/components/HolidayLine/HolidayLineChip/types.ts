import {ButtonHTMLAttributes, Ref} from 'react';

// Extra button attributes (onClick, aria-expanded, aria-haspopup, aria-controls...) are passed to the chip so a
// caller can turn it into a popover trigger; the ref is forwarded to the same button
export type THolidayLineChipProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className' | 'type' | 'name'
> & {
  isLoading: boolean;
  name: string | null;
  className?: string;
  // The always-mounted row around the chip; a popover returns focus here when the chip itself has gone
  slotRef?: Ref<HTMLDivElement>;
};
