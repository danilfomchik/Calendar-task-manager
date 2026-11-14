import {AI_INSIGHTS_FOOTNOTE, AI_INSIGHTS_VARIANT_CLASSES} from './constants';
import {TAIInsightsBodyProps} from './types';

// The parsed AI insights answer (holiday name, description, "Did you know" fact) plus the AI footnote.
// Renders a fragment so it stacks inside the parent's own gap layout.
const AIInsightsBody = ({insights, variant = 'block'}: TAIInsightsBodyProps) => {
  const {holiday, fact} = insights;
  const classes = AI_INSIGHTS_VARIANT_CLASSES[variant];
  const isEditorial = variant === 'editorial';

  return (
    <>
      {holiday && (
        <>
          <h3 className={classes.name}>{holiday.name}</h3>
          {holiday.description && <p className={classes.description}>{holiday.description}</p>}
        </>
      )}
      {fact &&
        (isEditorial ? (
          <p className={classes.fact}>
            <span aria-hidden className="mr-1 text-action">
              ✦
            </span>
            {fact}
          </p>
        ) : (
          <div className={classes.fact}>
            <span className="font-mono text-[10px] tracking-widest text-action uppercase">Did you know</span>
            <p className="mt-1 text-sm leading-relaxed">{fact}</p>
          </div>
        ))}
      <p className={classes.footnote}>{AI_INSIGHTS_FOOTNOTE}</p>
    </>
  );
};

export default AIInsightsBody;
