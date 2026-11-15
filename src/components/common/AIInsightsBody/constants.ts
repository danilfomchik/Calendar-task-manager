import CalloutFact from './CalloutFact';
import PullQuoteFact from './PullQuoteFact';
import {TAIInsightsBodyVariant, TAIInsightsVariant} from './types';

export const AI_INSIGHTS_FOOTNOTE = 'Written by AI, may contain mistakes';

// Everything a variant changes: text classes and how the "Did you know" fact renders.
// `relative` in the card variant lifts the text above the card's absolutely positioned glows
export const AI_INSIGHTS_VARIANTS: Record<TAIInsightsBodyVariant, TAIInsightsVariant> = {
  card: {
    nameClassName: 'relative font-display text-2xl leading-tight font-extrabold',
    descriptionClassName: 'relative text-sm leading-relaxed text-text-muted',
    footnoteClassName: 'relative text-xs text-text-faint',
    Fact: CalloutFact,
  },
  popover: {
    nameClassName: 'font-display text-3xl leading-none font-extrabold tracking-tight',
    descriptionClassName: 'text-sm leading-relaxed text-text-muted',
    footnoteClassName: 'text-xs text-text-faint',
    Fact: PullQuoteFact,
  },
};
