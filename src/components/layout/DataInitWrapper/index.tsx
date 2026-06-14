import moment from 'moment';
import {useEffect, useLayoutEffect, useMemo} from 'react';

import {useMediaQuery} from '@/hooks/useMediaQuery';
import {TEvent} from '@/redux/events/types';
import {handleEventsCountChangeInMap} from '@/redux/myCalendars/helpers';
import {setCalendarsMap} from '@/redux/myCalendars/myCalendarsSlice';
import {EventsCountChangeKind} from '@/redux/myCalendars/types';
import {setIsOpenSidebar} from '@/redux/sidebar/sidebarSlice';
import {useAppDispatch} from '@/redux/store';
import {formatDate} from '@/services/dateUtils';
import {getLocalStoredValues} from '@/services/utils';
import {CalendarsNames, StorageKeys} from '@/types/types';

const DataInitWrapper = () => {
  const dispatch = useAppDispatch();
  const isMobileScreen = useMediaQuery({size: 'md', direction: 'to'});

  const calendarsMap = useMemo(() => {
    let eventsCalendarsMap = {} as Record<string, Record<CalendarsNames, number>>;

    // list of stored events [{id: event}, ...]
    const initialEventsById = getLocalStoredValues(StorageKeys.eventsById, {});
    // get only events values from stored object
    const eventsValues: TEvent[] = Object.values(initialEventsById);

    // generate map of events count for each calendar for current month {work: 3, personal: 5, ...}
    eventsValues.forEach(event => {
      const calendarName = event.eventCalendar;
      const yearMonthKey = formatDate(moment(event.date), 'YYYY-MM');

      eventsCalendarsMap = handleEventsCountChangeInMap(
        eventsCalendarsMap,
        yearMonthKey,
        calendarName,
        EventsCountChangeKind.ADD,
      );
    });

    return eventsCalendarsMap;
  }, []);

  useEffect(() => {
    dispatch(setCalendarsMap(calendarsMap));
  }, [calendarsMap, dispatch]);

  useLayoutEffect(() => {
    dispatch(setIsOpenSidebar(!isMobileScreen));
  }, [dispatch, isMobileScreen]);

  return null;
};

export default DataInitWrapper;
