import {useMemo} from 'react';

import {IS_AI_INSIGHTS_ENABLED} from './enabled';
import {useGetDayHolidaysInfoQuery} from './holidaysApi';
import {parseAIContent} from './parseAIContent';

type TUseAIInsightsOptions = {skip?: boolean};

// The parsed AI insights answer for a date. Uses the query's current data, so an answer cached for a
// previous date is never returned while another date loads. Skipped (insights null) when the Groq flag is off.
export const useAIInsights = (date: string | undefined, {skip = false}: TUseAIInsightsOptions = {}) => {
  const {currentData, isFetching, isError} = useGetDayHolidaysInfoQuery(date, {
    skip: skip || !IS_AI_INSIGHTS_ENABLED || !date,
  });
  const insights = useMemo(() => parseAIContent(currentData?.choices?.[0]?.message?.content), [currentData]);

  return {insights, isFetching, isError};
};
