import {RootState} from '../store';

export const selectOpenedItems = (state: RootState) => state.overflowData.openedItems;
