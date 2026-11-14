// Visible height of the sheet when collapsed; the calendar reserves the same space.
// At a 390px viewport it must still show the first event below the header. Budget (px): handle 24 + date row 59
// + Holiday line 32 + gap 6 + Day note 44 (one line while unfocused) + 8 = 173, leaving room for a 55px event.
// Cut header padding before dropping anything if the header grows.
export const SHEET_PEEK = 232;
