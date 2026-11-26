import {useCallback} from 'react';
import {useSelector} from 'react-redux';

import {useOpenEventForm} from '@/hooks/useOpenEventForm';
import {selectSelectedDate} from '@/redux/date/selectors';

// Opens the event form in create mode for the selected day: the one add path behind the header Add event,
// the Agenda panel's "Add to …" and the Bottom sheet's docked +
export const useOpenCreateEvent = () => {
  const {openCreate} = useOpenEventForm();
  const selectedDate = useSelector(selectSelectedDate);

  return useCallback(() => openCreate(selectedDate), [openCreate, selectedDate]);
};
