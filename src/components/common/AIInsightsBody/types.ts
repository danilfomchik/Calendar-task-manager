import {ComponentType} from 'react';

import {TAIInsights} from '@/redux/dateHolidaysGenerator/parseAIContent';

// card: the Day page AI insights card (fact in a callout); popover: the Holiday popover (big name, fact as pull-quote)
export type TAIInsightsBodyVariant = 'card' | 'popover';

// Props shared by every variant's "Did you know" fact component
export type TAIInsightsFactProps = {fact: string};

export type TAIInsightsVariant = {
  nameClassName: string;
  descriptionClassName: string;
  footnoteClassName: string;
  Fact: ComponentType<TAIInsightsFactProps>;
};

export type TAIInsightsBodyProps = {
  insights: TAIInsights;
  variant?: TAIInsightsBodyVariant;
};
