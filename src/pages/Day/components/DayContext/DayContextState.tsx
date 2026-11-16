import {DragControls, useDragControls} from 'motion/react';
import {PropsWithChildren, createContext, useCallback, useContext, useMemo, useState} from 'react';

import {useMediaQuery} from '@/hooks/useMediaQuery';

type TDayContextState = {
  // below md the Day context is a Bottom sheet, from md a drawer
  isMobile: boolean;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  isSheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  // Lets the Context button drag the sheet open under the finger
  sheetDragControls: DragControls | null;
};

const DayContextState = createContext<TDayContextState>({
  isMobile: false,
  isDrawerOpen: true,
  toggleDrawer: () => {},
  isSheetOpen: false,
  openSheet: () => {},
  closeSheet: () => {},
  sheetDragControls: null,
});

// Lives on the Day page (which stays mounted across day changes), so the drawer keeps its state while stepping days
// Renders the page's root element so wrapping the page in it doesn't re-indent the page
export const DayContextProvider = ({children, className}: PropsWithChildren<{className?: string}>) => {
  const isMobile = useMediaQuery({size: 'sm', direction: 'to'});
  // desktop drawer is open by default; the mobile sheet is closed by default
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const sheetDragControls = useDragControls();

  const toggleDrawer = useCallback(() => setIsDrawerOpen(open => !open), []);
  const openSheet = useCallback(() => setIsSheetOpen(true), []);
  const closeSheet = useCallback(() => setIsSheetOpen(false), []);

  const value = useMemo(
    () => ({
      isMobile,
      isDrawerOpen,
      toggleDrawer,
      isSheetOpen: isSheetOpen && isMobile,
      openSheet,
      closeSheet,
      sheetDragControls,
    }),
    [isMobile, isDrawerOpen, toggleDrawer, isSheetOpen, openSheet, closeSheet, sheetDragControls],
  );

  return (
    <DayContextState.Provider value={value}>
      <div className={className}>{children}</div>
    </DayContextState.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDayContext = () => useContext(DayContextState);
