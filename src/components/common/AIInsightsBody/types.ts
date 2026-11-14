import {TAIInsights} from '@/redux/dateHolidaysGenerator/parseAIContent';

// block: the Day page AI insights card (fact in a callout); editorial: the Holiday popover (big name, fact as pull-quote)
export type TAIInsightsBodyVariant = 'block' | 'editorial';

export type TAIInsightsVariantClasses = {
  name: string;
  description: string;
  // block: the "Did you know" callout; editorial: the pull-quote
  fact: string;
  footnote: string;
};

export type TAIInsightsBodyProps = {
  insights: TAIInsights;
  variant?: TAIInsightsBodyVariant;
};
