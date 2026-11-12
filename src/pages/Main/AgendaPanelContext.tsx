import {PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {useMatch} from 'react-router';

import {useMediaQuery} from '@/hooks/useMediaQuery';
import {setSelectedDate} from '@/redux/date/dateSlice';
import {useAppDispatch} from '@/redux/store';
import {RouterPaths} from '@/types/types';

type TAgendaPanelContext = {
  isOpen: boolean;
  // selects the date and opens the Agenda panel for it
  openFor: (date: string) => void;
  close: () => void;
};

const AgendaPanelContext = createContext<TAgendaPanelContext>({
  isOpen: false,
  openFor: () => {},
  close: () => {},
});

// Provided by MainLayout (not the Home page) so the sidebar mini-calendar can call openFor too. The panel only
// exists on Home: off Home it is never open, and leaving Home forgets a dismissal, as when the provider
// unmounted with the Home page.
export const AgendaPanelProvider = ({children}: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  // the user's own choice; the panel is shown by default and comes back when returning to desktop
  const [isDismissed, setIsDismissed] = useState(false);

  const isHome = useMatch(RouterPaths.home) !== null;
  const [wasHome, setWasHome] = useState(isHome);

  if (wasHome !== isHome) {
    setWasHome(isHome);
    if (!isHome) setIsDismissed(false);
  }

  const openFor = useCallback(
    (date: string) => {
      dispatch(setSelectedDate(date));
      setIsDismissed(false);
    },
    [dispatch],
  );

  const close = useCallback(() => setIsDismissed(true), []);

  // the panel only exists from md up, but resizing below md must not count as dismissing it
  const isBelowMd = useMediaQuery({size: 'sm', direction: 'to'});
  const isOpen = isHome && !isDismissed && !isBelowMd;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDismissed(true);
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const value = useMemo(() => ({isOpen, openFor, close}), [isOpen, openFor, close]);

  return <AgendaPanelContext.Provider value={value}>{children}</AgendaPanelContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAgendaPanel = () => useContext(AgendaPanelContext);
