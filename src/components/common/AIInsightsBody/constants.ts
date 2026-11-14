import {TAIInsightsBodyVariant, TAIInsightsVariantClasses} from './types';

export const AI_INSIGHTS_FOOTNOTE = 'Written by AI, may contain mistakes';

// `relative` in the block variant lifts the text above the card's absolutely positioned glows
export const AI_INSIGHTS_VARIANT_CLASSES: Record<TAIInsightsBodyVariant, TAIInsightsVariantClasses> = {
  block: {
    name: 'relative font-display text-2xl leading-tight font-extrabold',
    description: 'relative text-sm leading-relaxed text-text-muted',
    fact: 'relative border-l-2 border-action bg-action/10 p-3',
    footnote: 'relative text-xs text-text-faint',
  },
  editorial: {
    name: 'font-display text-3xl leading-none font-extrabold tracking-tight',
    description: 'text-sm leading-relaxed text-text-muted',
    fact: 'border-t border-line pt-3 font-display text-base leading-snug text-text',
    footnote: 'text-xs text-text-faint',
  },
};
