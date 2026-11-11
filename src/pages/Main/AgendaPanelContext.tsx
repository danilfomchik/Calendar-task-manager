import {PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';

import {useMediaQuery} from '@/hooks/useMediaQuery';
import {setSelectedDate} from '@/redux/date/dateSlice';
import {selectSelectedDate} from '@/redux/date/selectors';
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
  // the user's own choice; the panel is shown by default and comes back when returning to desktop
  const [isDismissed, setIsDismissed] = useState(false);

  // selecting a date from outside the provider (the sidebar mini-calendar) re-opens the panel, as openFor does
  const selectedDate = useSelector(selectSelectedDate);
  const [panelDate, setPanelDate] = useState(selectedDate);

  if (panelDate !== selectedDate) {
    setPanelDate(selectedDate);
    setIsDismissed(false);
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
  const isOpen = !isDismissed && !isBelowMd;

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
