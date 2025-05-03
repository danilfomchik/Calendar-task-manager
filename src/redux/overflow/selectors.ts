import {RootState} from '../store';

export const selectOpenedItems = (state: RootState) => state.overflowData.currentlyOpened.length;
export const selectIsItemCurrentlyOpened = (refId: string) => (state: RootState) =>
    state.overflowData.currentlyOpened.includes(refId);
