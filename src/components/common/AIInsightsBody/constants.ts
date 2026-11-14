import {TAIInsightsBodyVariant, TAIInsightsVariantClasses} from './types';

export const AI_INSIGHTS_FOOTNOTE = 'Written by AI, may contain mistakes';

// `relative` in the block variant lifts the text above the card's absolutely positioned glows
export const AI_INSIGHTS_VARIANT_CLASSES: Record<TAIInsightsBodyVariant, TAIInsightsVariantClasses> = {
  block: {
    name: 'relative font-display text-2xl leading-tight font-extrabold',
    description: 'relative text-sm leading-relaxed text-text-muted',
    footnote: 'relative text-xs text-text-faint',
  },
  editorial: {
    name: 'font-display text-3xl leading-none font-extrabold tracking-tight',
    description: 'text-sm leading-relaxed text-text-muted',
    footnote: 'text-xs text-text-faint',
  },
};
