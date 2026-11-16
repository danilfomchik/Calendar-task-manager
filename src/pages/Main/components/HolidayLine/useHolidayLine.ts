import {useEffect, useState} from 'react';

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

  const base = {isEnabled, retry: refetch};
  const without = (status: Exclude<THolidayLineStatus, 'holiday'>): THolidayLineState => ({
    ...base,
    status,
    insights: null,
    name: null,
  });

  if (!isEnabled) return without('none');
  if (!isSettled || isFetching) return without('loading');
  if (isError) return without('error');

  const name = insights?.holiday?.name;

  return insights && name ? {...base, status: 'holiday', insights, name} : without('none');
};
