import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router';

import {useMediaQuery} from '@/hooks/useMediaQuery';
import {requestToday} from '@/redux/date/dateSlice';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {selectOpenedItems} from '@/redux/overflow/selectors';
import {useAppDispatch} from '@/redux/store';
import {EVENT_FORM_ID} from '@/services/constants';
import {getDayPath, getTodayKey} from '@/services/dateUtils';
import {FormActionType} from '@/types/eventFormTypes';

import {shiftDay} from '../helpers';

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;

  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
};

// Desktop keyboard shortcuts for the Day page: ← / → previous / next day, T today, N add event on the Viewed day.
// Ignored on mobile, while a text field is focused, while a modal or menu is open, and with modifier keys.
export const useDayShortcuts = (date: string) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({size: 'sm', direction: 'to'});
  const hasOpenedItems = useSelector(selectOpenedItems) > 0;
  const isEnabled = !isMobile && !hasOpenedItems;

  useEffect(() => {
    if (!isEnabled) return;

    const openAddEvent = () => {
      dispatch(onOpenItem(EVENT_FORM_ID));
      dispatch(setEventFormData({actionType: FormActionType.create, date}));
    };

    const actions: Record<string, () => void> = {
      arrowleft: () => navigate(getDayPath(shiftDay(date, -1))),
      arrowright: () => navigate(getDayPath(shiftDay(date, 1))),
      t: () => {
        dispatch(requestToday());
        navigate(getDayPath(getTodayKey()));
      },
      n: openAddEvent,
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (isTypingTarget(e.target) || isTypingTarget(document.activeElement)) return;

      const action = actions[e.key.toLowerCase()];

      if (!action) return;

      // keep the key from also reaching the page (scrolling, or typing into the form that N opens)
      e.preventDefault();
      action();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEnabled, date, navigate, dispatch]);
};
