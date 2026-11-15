// 'row': grows from 1 to 6 lines, then scrolls (Day page, Agenda panel).
// 'compact': stays on one line until focused, then behaves like 'row' (tight spaces such as the Bottom sheet peek).
export type TDayNoteVariant = 'row' | 'compact';

// 'boxed': a framed input row, dashed while empty (Day page Day context).
// 'margin': no frame, a 2px rule on the left, dashed while empty and green while editing (Home's Agenda panel and
// Bottom sheet, matching the Holiday line).
export type TDayNoteAppearance = 'boxed' | 'margin';

export type TDayNoteProps = {
  date: string;
  variant?: TDayNoteVariant;
  appearance?: TDayNoteAppearance;
};
