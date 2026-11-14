// 'row': grows from 1 to 6 lines, then scrolls (Day page, Agenda panel).
// 'compact': stays on one line until focused, then behaves like 'row' (tight spaces such as the Bottom sheet peek).
export type TDayNoteVariant = 'row' | 'compact';

export type TDayNoteProps = {
  date: string;
  variant?: TDayNoteVariant;
};
