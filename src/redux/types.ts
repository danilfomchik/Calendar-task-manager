export interface PreloadedState {
    [key: string]: unknown;
}

export enum SliceNames {
    columnsSlice = 'columnsData',
    dateSlice = 'dateData',
    overflowSlice = 'overflowData',
}
