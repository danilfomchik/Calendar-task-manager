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
  isOpen: false,
};

const sidebarSlice = createSlice({
  name: SliceNames.sidebarSlice,
  initialState,
  reducers,
});

export const {onToggleSidebar, setIsOpenSidebar} = sidebarSlice.actions;
export default sidebarSlice;
