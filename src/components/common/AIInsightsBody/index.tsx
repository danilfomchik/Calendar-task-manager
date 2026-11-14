import {AI_INSIGHTS_FOOTNOTE} from './constants';
import {TAIInsightsBodyProps} from './types';

// The parsed AI insights answer (holiday name, description, "Did you know" fact) plus the AI footnote.
// Renders a fragment so it stacks inside the parent's own gap layout.
const AIInsightsBody = ({insights, variant = 'block'}: TAIInsightsBodyProps) => {
  const {holiday, fact} = insights;

  if (variant === 'editorial') {
    return (
      <>
        {holiday && (
          <>
            <h3 className="font-display text-3xl leading-none font-extrabold tracking-tight">{holiday.name}</h3>
            {holiday.description && <p className="text-sm leading-relaxed text-text-muted">{holiday.description}</p>}
          </>
        )}
        {fact && (
          <p className="border-t border-line pt-3 font-display text-base leading-snug text-text">
            <span aria-hidden className="mr-1 text-action">
              ✦
            </span>
            {fact}
          </p>
        )}
        <p className="text-xs text-text-faint">{AI_INSIGHTS_FOOTNOTE}</p>
      </>
    );
  }

  return (
    <>
      {holiday && (
        <>
          <h3 className="relative font-display text-2xl leading-tight font-extrabold">{holiday.name}</h3>
          {holiday.description && (
            <p className="relative text-sm leading-relaxed text-text-muted">{holiday.description}</p>
          )}
        </>
      )}
      {fact && (
        <div className="relative border-l-2 border-action bg-action/10 p-3">
          <span className="font-mono text-[10px] tracking-widest text-action uppercase">Did you know</span>
          <p className="mt-1 text-sm leading-relaxed">{fact}</p>
        </div>
      )}
      <p className="relative text-xs text-text-faint">{AI_INSIGHTS_FOOTNOTE}</p>
    </>
  );
};

export default AIInsightsBody;
