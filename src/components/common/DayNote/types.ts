// 'boxed': a framed input row, dashed while empty (Day page Day context).
// 'margin': no frame, a 2px rule on the left, dashed while empty and green while editing (Home's Agenda panel and
// Bottom sheet, matching the Holiday line).
export type TDayNoteAppearance = 'boxed' | 'margin';

export type TDayNoteProps = {
  date: string;
  appearance?: TDayNoteAppearance;
};
