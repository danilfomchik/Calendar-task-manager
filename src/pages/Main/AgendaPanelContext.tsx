import {PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {useMatch} from 'react-router';

import {useMediaQuery} from '@/hooks/useMediaQuery';
import {AGENDA_PANEL_ID, AGENDA_TOGGLE_ID} from '@/pages/Main/constants';
import {useEventHighlight} from '@/pages/Main/hooks/useEventHighlight';
import {setSelectedDate} from '@/redux/date/dateSlice';
import {selectOpenedItems} from '@/redux/overflow/selectors';
import {useAppDispatch} from '@/redux/store';
import {isTypingTarget} from '@/services/dom';
import {RouterPaths} from '@/types/types';

type TAgendaPanelContext = {
  isOpen: boolean;
  // selects the date and opens the Agenda panel for it
  openFor: (date: string) => void;
  // a grid chip's click: selects the event's day like openFor and briefly highlights its row in the Agenda panel,
  // where editing starts
  showEvent: (date: string, eventId: string) => void;
  // the event whose row is highlighted, cleared after a moment (useEventHighlight)
  highlightedEventId: string | null;
  close: () => void;
  // shows a dismissed panel for the selected date again, or dismisses it (the header's Agenda toggle)
  toggle: () => void;
};

const AgendaPanelContext = createContext<TAgendaPanelContext>({
  isOpen: false,
  openFor: () => {},
  showEvent: () => {},
  highlightedEventId: null,
  close: () => {},
  toggle: () => {},
});

// The stable half of the context (functions only, never changes after mount), so the Month grid's 42 cells and their
// chips don't re-render when the panel opens, closes or highlights a row
type TAgendaPanelActions = Pick<TAgendaPanelContext, 'openFor' | 'showEvent' | 'close' | 'toggle'>;

const AgendaPanelActionsContext = createContext<TAgendaPanelActions>({
  openFor: () => {},
  showEvent: () => {},
  close: () => {},
  toggle: () => {},
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

  const {highlightedEventId, highlight} = useEventHighlight();

  const showEvent = useCallback(
    (date: string, eventId: string) => {
      openFor(date);
      highlight(eventId);
    },
    [openFor, highlight],
  );

  // Dismissing unmounts the panel; if focus is inside it, it would fall to the page, so it moves to the Agenda toggle
  // first (always mounted from md, where the panel lives), which can show the panel again
  const close = useCallback(() => {
    if (document.getElementById(AGENDA_PANEL_ID)?.contains(document.activeElement)) {
      document.getElementById(AGENDA_TOGGLE_ID)?.focus();
    }

    setIsDismissed(true);
  }, []);

  // the panel only exists from md up, but resizing below md must not count as dismissing it
  const isBelowMd = useMediaQuery({size: 'sm', direction: 'to'});
  const isOpen = isHome && !isDismissed && !isBelowMd;

  // read when this render's listener was attached, so a menu that closes on the same Escape still counts as open
  const hasOpenedItems = useSelector(selectOpenedItems) > 0;

  // Escape closes only the topmost layer: the panel is the bottom one, so it ignores Escape while a modal or menu is
  // open (they close themselves), after a popover has handled it, and while a text field such as the Day note has focus
  useEffect(() => {
    if (!isOpen || hasOpenedItems) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented || isTypingTarget(e.target)) return;

      close();
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, hasOpenedItems, close]);

  // only clicked from the toggle itself, so focus is already where it should stay
  const toggle = useCallback(() => setIsDismissed(dismissed => !dismissed), []);

  const value = useMemo(
    () => ({isOpen, openFor, showEvent, highlightedEventId, close, toggle}),
    [isOpen, openFor, showEvent, highlightedEventId, close, toggle],
  );

  const actions = useMemo(() => ({openFor, showEvent, close, toggle}), [openFor, showEvent, close, toggle]);

  return (
    <AgendaPanelActionsContext.Provider value={actions}>
      <AgendaPanelContext.Provider value={value}>{children}</AgendaPanelContext.Provider>
    </AgendaPanelActionsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAgendaPanel = () => useContext(AgendaPanelContext);

// Only the panel's functions: use it where isOpen / highlightedEventId aren't read, so those changes don't re-render
// eslint-disable-next-line react-refresh/only-export-components
export const useAgendaPanelActions = () => useContext(AgendaPanelActionsContext);
