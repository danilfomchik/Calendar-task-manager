export type TDayCellProps = {
  date: string;
  // days from the Viewed day: -1 and 1 get the "Previous" / "Next" hover hint
  offset: number;
  isToday: boolean;
  isPast: boolean;
};
