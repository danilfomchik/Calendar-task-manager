export interface PreloadedState {
  [key: string]: unknown;
}

export enum SliceNames {
  eventsSlice = 'eventsData',
  dateSlice = 'dateData',
  overflowSlice = 'overflowData',
  myCalendarsSlice = 'myCalendarsData',
  sidebarSlice = 'sidebarData',
}
