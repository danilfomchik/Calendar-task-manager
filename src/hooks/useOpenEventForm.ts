import {useMemo} from 'react';

import {setEventFormData} from '@/redux/events/eventsSlice';
import {TEvent} from '@/redux/events/types';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {EVENT_FORM_ID} from '@/services/constants';
import {FormActionType} from '@/types/eventFormTypes';

// Opens the event form modal: `openCreate` for a new event on a date, `openEdit` for an existing event.
// Every add and edit path goes through here, so the modal and the form data are always set together.
export const useOpenEventForm = () => {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      openCreate: (date: string) => {
        dispatch(onOpenItem(EVENT_FORM_ID));
        dispatch(setEventFormData({actionType: FormActionType.create, date}));
      },
      openEdit: (event: TEvent) => {
        dispatch(onOpenItem(EVENT_FORM_ID));
        dispatch(setEventFormData({actionType: FormActionType.edit, event}));
      },
    }),
    [dispatch],
  );
};
