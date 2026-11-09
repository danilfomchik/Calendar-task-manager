import {createSlice} from '@reduxjs/toolkit';

import {SliceNames} from '../types';
import {TSidebarState} from './types';

const reducers = {
  setIsOpenSidebar: (state: TSidebarState, {payload}: {payload: boolean}) => {
    state.isOpen = payload;
  },
  onToggleSidebar: (state: TSidebarState) => {
    state.isOpen = !state.isOpen;
  },
};

const initialState: TSidebarState = {
  // matches the desktop default so the sidebar does not slide in on page load
  isOpen: typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
};

const sidebarSlice = createSlice({
  name: SliceNames.sidebarSlice,
  initialState,
  reducers,
});

export const {onToggleSidebar, setIsOpenSidebar} = sidebarSlice.actions;
export default sidebarSlice;
