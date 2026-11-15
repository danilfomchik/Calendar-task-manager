// Visible height of the sheet when collapsed; the calendar reserves the same space.
// At a 390px viewport it must still show the first event below the header. Budget (px): handle 24 (its 44px hit
// area overlaps the date row) + date row 56 + events total 24 + gap 8 + Calendar mix 3 + gap 10 + Holiday line
// 32 + 8 + list top 9 = 174, leaving room for a 55px event (title plus calendar line). The Day note is pinned at
// the foot of the sheet, outside the peek.
// Cut header padding before dropping anything if the header grows.
export const SHEET_PEEK = 232;
