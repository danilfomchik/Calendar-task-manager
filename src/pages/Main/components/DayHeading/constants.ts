import {TDayHeadingClasses, TDayHeadingSize} from './types';

export const DAY_HEADING_CLASSES: Record<TDayHeadingSize, TDayHeadingClasses> = {
  panel: {
    row: 'gap-4',
    numeral: 'text-[88px] leading-[0.78]',
    weekdayRow: 'gap-2',
    weekday: 'text-xl',
    today: 'text-xs',
    month: 'text-sm',
  },
  sheet: {
    row: 'gap-3',
    numeral: 'text-6xl leading-[0.8]',
    weekdayRow: 'gap-1.5',
    weekday: 'text-[15px]',
    today: 'text-[10px]',
    month: 'text-[13px]',
  },
};
