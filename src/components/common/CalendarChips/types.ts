export type TCalendarChip = {
  name: string;
  color: string;
  count: number;
};

export type TCalendarChipsProps = {
  chips: TCalendarChip[];
  className?: string;
};
