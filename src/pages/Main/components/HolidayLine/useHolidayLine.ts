import {useCallback, useEffect, useState} from 'react';

import {useAIInsights} from '@/redux/dateHolidaysGenerator/useAIInsights';

import {THolidayLineState, THolidayLineStatus} from './types';

const SETTLE_MS = 400;

// The date once it has stopped changing for SETTLE_MS, so clicking through days fires one request, not one per click
const useSettledDate = (date: string) => {
  const [settled, setSettled] = useState(date);

  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(date), SETTLE_MS);

    return () => window.clearTimeout(timer);
  }, [date]);

  return settled;
};

// Data for the Holiday line: the selected date's AI insights, requested only once the date has settled and shown
// only when the answer belongs to that date (useAIInsights reads currentData, so no stale answer leaks)
export const useHolidayLine = (date: string): THolidayLineState => {
  const settled = useSettledDate(date);
  const isSettled = settled === date;

  const {isEnabled, insights, isFetching, isError, refetch} = useAIInsights(settled, {skip: !isSettled});

  // The date whose Retry is in flight; keyed by date so a retry that outlives a date change never marks another day
  const [retryingDate, setRetryingDate] = useState<string | null>(null);
  const isRetrying = isSettled && retryingDate === settled;

  const retry = useCallback(() => {
    const retried = settled;
    const done = () => setRetryingDate(current => (current === retried ? null : current));

    setRetryingDate(retried);
    refetch().then(done, done);
  }, [refetch, settled]);

  const base = {isEnabled, isRetrying, retry};
  const without = (status: Exclude<THolidayLineStatus, 'holiday'>): THolidayLineState => ({
    ...base,
    status,
    insights: null,
    name: null,
  });

  if (!isEnabled) return without('none');
  if (!isSettled) return without('loading');
  // keep the error row (spinner on) while retrying instead of swapping to the skeleton and back
  if (isRetrying || isError) return without('error');
  if (isFetching) return without('loading');

  const name = insights?.holiday?.name;

  return insights && name ? {...base, status: 'holiday', insights, name} : without('none');
};
