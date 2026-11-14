import AIInsightsBody from '@/components/common/AIInsightsBody';
import SkeletonLine from '@/components/ui/SkeletonLine';
import {IS_AI_INSIGHTS_ENABLED} from '@/redux/dateHolidaysGenerator/enabled';
import {useAIInsights} from '@/redux/dateHolidaysGenerator/useAIInsights';

import {BlockCard} from '../BlockCard';
import {DayContextBlock} from '../types';
import {TAIInsightsContentProps, TAIInsightsFrameProps} from './types';

const Frame = ({children, busy = false}: TAIInsightsFrameProps) => (
  <div className="bg-linear-to-br from-info via-action to-info p-px">
    <BlockCard
      label="AI insights"
      busy={busy}
      className="relative overflow-hidden bg-surface-sunken"
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
  const {insights, isFetching, isError} = useAIInsights(date);

  if (isFetching) return <AIInsightsSkeleton />;
  if (isError || !insights) return null;

  return (
    <Frame>
      <AIInsightsBody insights={insights} />
    </Frame>
  );
};

// AI insights (holiday + "Did you know"): nothing when the Groq flag is off, on error or on malformed content
const AIInsights: DayContextBlock = ({date}) => (IS_AI_INSIGHTS_ENABLED ? <AIInsightsContent date={date} /> : null);

export default AIInsights;
