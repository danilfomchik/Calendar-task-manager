export type TDayProps = {
  date: string;
  // the grid's single tab stop (the selected day, or the 1st of the month when the selection is elsewhere)
  isTabStop: boolean;
  isSelected: boolean;
  isToday: boolean;
  // a neighbouring month's day shown to fill the grid's weeks
  isOutsideMonth: boolean;
  // below md: dots instead of chips
  isMobileScreen: boolean;
  // from md, a cell too narrow for chips (MonthGrid's useCompactCells): dots instead of chips, under the numeral
  isCompact: boolean;
};
