import CalloutFact from './CalloutFact';
import PullQuoteFact from './PullQuoteFact';
import {TAIInsightsBodyVariant, TAIInsightsVariant} from './types';

export const AI_INSIGHTS_FOOTNOTE = 'Written by AI, may contain mistakes';

// Everything a variant changes: text classes and how the "Did you know" fact renders.
// `relative` in the card variant lifts the text above the card's absolutely positioned glows
export const AI_INSIGHTS_VARIANTS: Record<TAIInsightsBodyVariant, TAIInsightsVariant> = {
  card: {
    nameClassName: 'relative text-h3',
    descriptionClassName: 'relative text-para-s text-text-muted',
    footnoteClassName: 'relative text-caption text-text-faint',
    Fact: CalloutFact,
  },
  popover: {
    nameClassName: 'text-h2',
    descriptionClassName: 'text-para-s text-text-muted',
    footnoteClassName: 'text-caption text-text-faint',
    Fact: PullQuoteFact,
  },
};
