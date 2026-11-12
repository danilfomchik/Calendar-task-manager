import {useMemo} from 'react';

import {useGetDayHolidaysInfoQuery} from '@/redux/dateHolidaysGenerator/holidaysApi';
import {cx} from '@/services/utils';

import {BlockCard, SkeletonLine} from '../BlockCard';
import {DayContextBlock} from '../types';
import {IS_AI_INSIGHTS_ENABLED} from './enabled';
import {parseAIContent} from './parseAIContent';
import {TAIInsightsContentProps, TAIInsightsFrameProps} from './types';

// Same minimum for skeleton and content so the blocks below don't jump when the answer arrives
// (sampled answers measure 333-379px in the 320px drawer)
const CARD_MIN_HEIGHT = 'min-h-96';

const Frame = ({children, busy = false}: TAIInsightsFrameProps) => (
  <div className="bg-linear-to-br from-info via-action to-info p-px">
    <BlockCard
      label="AI insights"
      busy={busy}
      className={cx('relative overflow-hidden bg-surface-sunken', CARD_MIN_HEIGHT)}
      header={
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-action/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-12 -left-10 size-40 rounded-full bg-info/20 blur-3xl"
          />
          <div className="relative flex items-center gap-2">
            <span aria-hidden className="text-action">
              ✦
            </span>
            <span className="font-mono text-[10px] tracking-widest text-action uppercase">AI insight</span>
          </div>
        </>
      }>
      {children}
    </BlockCard>
  </div>
);

const AIInsightsSkeleton = () => (
  <Frame busy>
    <span className="sr-only">Loading AI insights</span>
    <SkeletonLine className="relative h-7 w-3/4" />
    <div className="relative flex flex-col gap-2">
      <SkeletonLine className="h-3.5 w-full" />
      <SkeletonLine className="h-3.5 w-full" />
      <SkeletonLine className="h-3.5 w-2/3" />
    </div>
    <div className="relative flex flex-col gap-2 border-l-2 border-line-strong p-3">
      <SkeletonLine className="h-2.5 w-20" />
      <SkeletonLine className="h-3.5 w-full" />
      <SkeletonLine className="h-3.5 w-5/6" />
    </div>
  </Frame>
);

const AIInsightsContent = ({date}: TAIInsightsContentProps) => {
  const {data, isFetching, isError} = useGetDayHolidaysInfoQuery(date);
  const insights = useMemo(() => parseAIContent(data?.choices?.[0]?.message?.content), [data]);

  if (isFetching) return <AIInsightsSkeleton />;
  if (isError || !insights) return null;

  return (
    <Frame>
      {insights.holiday && (
        <>
          <h3 className="relative font-display text-2xl leading-tight font-extrabold">{insights.holiday.name}</h3>
          {insights.holiday.description && (
            <p className="relative text-sm leading-relaxed text-text-muted">{insights.holiday.description}</p>
          )}
        </>
      )}
      {insights.fact && (
        <div className="relative border-l-2 border-action bg-action/10 p-3">
          <span className="font-mono text-[10px] tracking-widest text-action uppercase">Did you know</span>
          <p className="mt-1 text-sm leading-relaxed">{insights.fact}</p>
        </div>
      )}
    </Frame>
  );
};

// AI insights (holiday + "Did you know"): nothing when the Groq flag is off, on error or on malformed content
const AIInsights: DayContextBlock = ({date}) => (IS_AI_INSIGHTS_ENABLED ? <AIInsightsContent date={date} /> : null);

export default AIInsights;
