// One plain-text Day note per date ('YYYY-MM-DD'). Notes are not events and are counted nowhere.
export type TDayNotesState = {
  notesByDate: Record<string, string>;
};

export type TSetDayNotePayload = {date: string; text: string};
