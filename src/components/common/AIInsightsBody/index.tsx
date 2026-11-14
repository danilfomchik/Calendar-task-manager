import {ComponentType} from 'react';

import CalloutFact from './CalloutFact';
import PullQuoteFact from './PullQuoteFact';
import {AI_INSIGHTS_FOOTNOTE, AI_INSIGHTS_VARIANT_CLASSES} from './constants';
import {TAIInsightsBodyProps, TAIInsightsBodyVariant} from './types';

// How each variant renders the "Did you know" fact; text classes for the rest live in AI_INSIGHTS_VARIANT_CLASSES
const FACT_BY_VARIANT: Record<TAIInsightsBodyVariant, ComponentType<{fact: string}>> = {
  block: CalloutFact,
  editorial: PullQuoteFact,
};

// The parsed AI insights answer (holiday name, description, "Did you know" fact) plus the AI footnote.
// Renders a fragment so it stacks inside the parent's own gap layout.
const AIInsightsBody = ({insights, variant = 'block'}: TAIInsightsBodyProps) => {
  const {holiday, fact} = insights;
  const classes = AI_INSIGHTS_VARIANT_CLASSES[variant];
  const Fact = FACT_BY_VARIANT[variant];

  return (
    <>
      {holiday && (
        <>
          <h3 className={classes.name}>{holiday.name}</h3>
          {holiday.description && <p className={classes.description}>{holiday.description}</p>}
        </>
      )}
      {fact && <Fact fact={fact} />}
      <p className={classes.footnote}>{AI_INSIGHTS_FOOTNOTE}</p>
    </>
  );
};

export default AIInsightsBody;
