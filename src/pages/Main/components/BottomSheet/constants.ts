import {SHEET_DEFAULT_TOP_GAP} from '@/components/common/Sheet/constants';

// All sizes here are px at the default 16px root font size. What they measure (header, week rows, sheet header, event
// rows) is set in rem, so `useSheetPeek` scales
// them to the root size: with a raised browser font size the budget grows with the layout and the sheet does not cover
// the Month grid.

// Visible height of the sheet when collapsed, where the screen allows it (useSheetPeek lowers it on short phones so
// the Month grid always keeps its six rows); the calendar reserves the same space.
// It must show three whole event rows, so a busy day reads as a list rather than one row. Budget (px): handle 24 (its
// 44px hit area overlaps the date row) + date row 47 (numeral, with Open day and the 44px add button at its right) + 12 + the events total 30 +
// 8 + the Calendar mix 3 + list top 8 + three 60px rows with two 6px gaps 192 + 5 margin (check it
// at 390x844: the third row should end 5px above the peek's edge). A free day's Holiday line, Next event row and the
// start of After that fit as well (the rest scrolls). On a busy day the Holiday line follows the list and the Day note
// is pinned at the foot of the sheet, so both stay out of the peek. Cut header padding before dropping a row if the header grows.
export const SHEET_PEEK = 24 + 47 + 12 + 30 + 8 + 3 + 8 + 192 + 5;

// --height-home-header below md (index.css), where the Bottom sheet lives
export const HOME_HEADER_HEIGHT_MOBILE = 64;

// What the Month grid needs above the collapsed sheet on mobile (px): weekday labels 28 (py-1.5 + caption line) +
// six 44px week rows with the grid's min height (min-h-71.5 = 286). The add button is docked in the sheet's date row,
// inside the peek, so it needs no strip here.
export const MOBILE_GRID_RESERVE = 28 + 286;

// The peek never shrinks below the sheet's handle (24px), so the collapsed sheet can always be tapped or dragged open.
// Between this and SHEET_PEEK the peek takes whatever the six week rows leave: the date block and most of one event row on a
// 320x568 phone.
export const SHEET_PEEK_MIN = 24;

// Space above the expanded sheet: the shared default gap plus the mobile header, which the sheet's fixed layer also
// covers (for the backdrop), so the expanded sheet stops below the header
export const SHEET_TOP_GAP = SHEET_DEFAULT_TOP_GAP + HOME_HEADER_HEIGHT_MOBILE;
