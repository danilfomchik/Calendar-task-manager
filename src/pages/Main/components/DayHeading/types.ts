import {ReactNode} from 'react';

// panel: the desktop Agenda panel (88px numeral); sheet: the mobile Bottom sheet (60px numeral)
export type TDayHeadingSize = 'panel' | 'sheet';

export type TDayHeadingClasses = {
  row: string;
  numeral: string;
  weekdayRow: string;
  weekday: string;
  today: string;
  month: string;
};

export type TDayHeadingProps = {
  date: string;
  size: TDayHeadingSize;
  // the control at the right of the row (close button, Open day link)
  children?: ReactNode;
};
