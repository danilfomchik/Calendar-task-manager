import {useCallback, useEffect, useState} from 'react';

import {useAIInsights} from '@/redux/dateHolidaysGenerator/useAIInsights';

import {THolidayLineState, THolidayLineStatus} from './types';

const SETTLE_MS = 400;
// The Groq request has no timeout of its own; past this the skeleton gives way to the error row and its Retry
const LOADING_TIMEOUT_MS = 15_000;

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
// only when the answer belongs to that date (useAIInsights reads currentData, so no stale answer leaks). Loading is
// capped at LOADING_TIMEOUT_MS, after which the row shows the error state with Retry
export const useHolidayLine = (date: string): THolidayLineState => {
  const settled = useSettledDate(date);
  const isSettled = settled === date;

  const {isEnabled, insights, isFetching, isError, refetch} = useAIInsights(settled, {skip: !isSettled});

  // The date whose Retry is in flight; keyed by date so a retry that outlives a date change never marks another day
  const [retryingDate, setRetryingDate] = useState<string | null>(null);
  const isRetrying = isSettled && retryingDate === settled;

  // The date whose request ran past LOADING_TIMEOUT_MS. Each Retry restarts the clock (attempt), and the mark is
  // dropped once nothing is in flight, so a later request for the same date starts with a fresh one
  const isPending = isSettled && isFetching;
  const [timedOutDate, setTimedOutDate] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const isTimedOut = isPending && timedOutDate === settled;

  if (!isPending && timedOutDate !== null) setTimedOutDate(null);

  useEffect(() => {
    if (!isPending) return;

    const timer = window.setTimeout(() => {
      setTimedOutDate(settled);
      // a Retry that hangs as well turns its spinner back into the error row
      setRetryingDate(current => (current === settled ? null : current));
    }, LOADING_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [isPending, settled, attempt]);

  const retry = useCallback(() => {
    const retried = settled;
    const done = () => setRetryingDate(current => (current === retried ? null : current));

    setTimedOutDate(null);
    setAttempt(count => count + 1);
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
  // keep the error row (spinner on) while retrying instead of swapping to the skeleton and back; a request that ran
  // too long shows the same row
  if (isRetrying || isError || isTimedOut) return without('error');
  if (isFetching) return without('loading');

  const name = insights?.holiday?.name;

  return insights && name ? {...base, status: 'holiday', insights, name} : without('none');
};
