import {TDayHeadingClasses, TDayHeadingSize} from './types';

export const DAY_HEADING_CLASSES: Record<TDayHeadingSize, TDayHeadingClasses> = {
  panel: {
    row: 'gap-4',
    numeral: 'text-numeral-xl',
    weekdayRow: 'gap-2',
    weekday: 'text-h4',
    today: 'text-caption',
    month: 'text-para-s',
  },
  sheet: {
    // tighter inside the Bottom sheet's narrow date row (its size container, under 20rem)
    row: 'gap-3 @max-xs:gap-2',
    numeral: 'text-numeral-m',
    weekdayRow: 'gap-1.5',
    weekday: 'text-h6',
    today: 'text-caption',
    month: 'text-para-s',
  },
};
