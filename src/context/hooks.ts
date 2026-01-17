import {useContext} from 'react';

import {CalendarContext} from './calendar-context';

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error('useCalendarContext must be used within a CalendarProvider');
  }

  return context;
};
