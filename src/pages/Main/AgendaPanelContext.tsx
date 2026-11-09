import {PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';

import {useMediaQuery} from '@/hooks/useMediaQuery';
import {setSelectedDate} from '@/redux/date/dateSlice';
import {useAppDispatch} from '@/redux/store';

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

export const AgendaPanelProvider = ({children}: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const openFor = useCallback(
    (date: string) => {
      dispatch(setSelectedDate(date));
      setIsOpen(true);
    },
    [dispatch],
  );

  const close = useCallback(() => setIsOpen(false), []);

  // the panel only exists from md up: don't keep it "open" while hidden
  const isBelowMd = useMediaQuery({size: 'sm', direction: 'to'});

  useEffect(() => {
    if (isBelowMd) setIsOpen(false);
  }, [isBelowMd]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const value = useMemo(() => ({isOpen, openFor, close}), [isOpen, openFor, close]);

  return <AgendaPanelContext.Provider value={value}>{children}</AgendaPanelContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAgendaPanel = () => useContext(AgendaPanelContext);
