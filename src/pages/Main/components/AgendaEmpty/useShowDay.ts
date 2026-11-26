import {useCallback} from 'react';

import {useAgendaPanelActions} from '@/pages/Main/AgendaPanelContext';
import {focusDayCellAfter} from '@/pages/Main/dayCell';
import {setFullDate} from '@/redux/date/dateSlice';
import {useAppDispatch} from '@/redux/store';

// Shows a later day from an empty day's body: shows that day's month, selects the day (highlighting the event's row
// when one is given, as a grid chip's click does), then hands focus to the day's cell in the Month grid, since the row
// that was pressed goes away with the empty day.
export const useShowDay = () => {
  const dispatch = useAppDispatch();
  const {openFor, showEvent} = useAgendaPanelActions();

  return useCallback(
    (date: string, eventId?: string) => {
      focusDayCellAfter(date, () => {
        dispatch(setFullDate(date));
        if (eventId) showEvent(date, eventId);
        else openFor(date);
      });
    },
    [dispatch, openFor, showEvent],
  );
};
