import {useEffect, useState} from 'react';

import {IS_AI_INSIGHTS_ENABLED} from '@/redux/dateHolidaysGenerator/enabled';
import {useAIInsights} from '@/redux/dateHolidaysGenerator/useAIInsights';

import {THolidayLineState} from './types';

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

  const {insights, isFetching} = useAIInsights(settled, {skip: !isSettled});

  if (!IS_AI_INSIGHTS_ENABLED) return {isEnabled: false, isLoading: false, insights: null, name: null};

  if (!isSettled || isFetching) return {isEnabled: true, isLoading: true, insights: null, name: null};

  return {isEnabled: true, isLoading: false, insights, name: insights?.holiday?.name ?? null};
};
