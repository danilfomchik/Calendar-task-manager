import {useMemo} from 'react';

import {useEventsList} from '@/hooks/useEventsList';
import {getCalendarColor} from '@/services/calendars';

const FADED_SEGMENT_COLOR = 'var(--color-line-strong)';

// Segment colours of a day's events, in list order. Reads every event: the Calendar filter never applies here.
export const useEventMix = (date: string, isPast: boolean) => {
  const events = useEventsList(date);

  return useMemo(
    () =>
      (events ?? []).map(event =>
        isPast ? FADED_SEGMENT_COLOR : (getCalendarColor(event.eventCalendar) ?? FADED_SEGMENT_COLOR),
      ),
    [events, isPast],
  );
};
