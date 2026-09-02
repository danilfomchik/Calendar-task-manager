import {RootState} from '../store';

export const selectIsSidebarOpen = (state: RootState) => state.sidebarData.isOpen;
