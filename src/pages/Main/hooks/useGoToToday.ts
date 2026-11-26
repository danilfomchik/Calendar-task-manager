import {useCallback} from 'react';

import {useAgendaPanelActions} from '@/pages/Main/AgendaPanelContext';
import {requestToday, setFullDate} from '@/redux/date/dateSlice';
import {useAppDispatch} from '@/redux/store';
import {getTodayKey} from '@/services/dateUtils';

// Today (the header button): shows today's month, selects today and shows the Agenda panel for it,
// as selecting a day in the grid does, and resets the sidebar mini-calendar's month browsing (requestToday)
export const useGoToToday = () => {
  const dispatch = useAppDispatch();
  const {openFor} = useAgendaPanelActions();

  return useCallback(() => {
    const today = getTodayKey();

    dispatch(setFullDate(today));
    dispatch(requestToday());
    openFor(today);
  }, [dispatch, openFor]);
};
