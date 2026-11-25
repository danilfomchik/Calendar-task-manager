import {describeHolidayRegion} from '@/redux/dateHolidaysGenerator/parseAIContent';

import {AI_INSIGHTS_FOOTNOTE, AI_INSIGHTS_VARIANTS} from './constants';
import {TAIInsightsBodyProps} from './types';

// The parsed AI insights answer (holiday name, where it is observed, description, "Did you know" fact) plus the AI footnote.
// Renders a fragment so it stacks inside the parent's own gap layout.
const AIInsightsBody = ({insights, variant = 'card'}: TAIInsightsBodyProps) => {
  const {holiday, fact} = insights;
  const {nameClassName, descriptionClassName, footnoteClassName, Fact} = AI_INSIGHTS_VARIANTS[variant];

  return (
    <>
      {holiday && (
        <>
          <h3 className={nameClassName}>{holiday.name}</h3>
          {/* whose holiday it is: the answer is not tied to the user's country */}
          {describeHolidayRegion(holiday.region) && (
            <p className={footnoteClassName}>{describeHolidayRegion(holiday.region)}</p>
          )}
          {holiday.description && <p className={descriptionClassName}>{holiday.description}</p>}
        </>
      )}
      {fact && <Fact fact={fact} />}
      <p className={footnoteClassName}>{AI_INSIGHTS_FOOTNOTE}</p>
    </>
  );
};

export default AIInsightsBody;
