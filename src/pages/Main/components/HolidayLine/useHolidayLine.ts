import {useEffect, useMemo, useState} from 'react';

import {IS_AI_INSIGHTS_ENABLED} from '@/pages/Day/components/DayContext/blocks/AIInsights/enabled';
import {parseAIContent} from '@/pages/Day/components/DayContext/blocks/AIInsights/parseAIContent';
import {useGetDayHolidaysInfoQuery} from '@/redux/dateHolidaysGenerator/holidaysApi';

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

// Data for the Holiday line: the selected date's AI insights, shown only once the date has settled and only when
// the answer belongs to that date (currentData is cleared while a new date is fetching, so no stale answer leaks)
export const useHolidayLine = (date: string): THolidayLineState => {
  const settled = useSettledDate(date);
  const isSettled = settled === date;

  const {currentData, isFetching} = useGetDayHolidaysInfoQuery(settled, {
    skip: !IS_AI_INSIGHTS_ENABLED || !isSettled,
  });
  const insights = useMemo(() => parseAIContent(currentData?.choices?.[0]?.message?.content), [currentData]);

  if (!IS_AI_INSIGHTS_ENABLED) return {isEnabled: false, isLoading: false, insights: null, name: null};

  if (!isSettled || isFetching) return {isEnabled: true, isLoading: true, insights: null, name: null};

  return {isEnabled: true, isLoading: false, insights, name: insights?.holiday?.name ?? null};
};
