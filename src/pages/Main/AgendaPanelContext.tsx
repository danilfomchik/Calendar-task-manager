import {PropsWithChildren, createContext, useCallback, useContext, useMemo, useState} from 'react';

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

  const value = useMemo(() => ({isOpen, openFor, close}), [isOpen, openFor, close]);

  return <AgendaPanelContext.Provider value={value}>{children}</AgendaPanelContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAgendaPanel = () => useContext(AgendaPanelContext);
