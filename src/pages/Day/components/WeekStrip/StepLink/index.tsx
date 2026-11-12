import {cx} from '@/services/utils';

import {TStepLinkProps} from './types';

// Chevron at either end of the Week strip (desktop): shows the previous / next week, without changing the Viewed day
const StepLink = ({side, onClick}: TStepLinkProps) => {
  const isPrev = side === 'prev';
  const label = `${isPrev ? 'Previous' : 'Next'} week`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cx(
        'hidden w-11 shrink-0 cursor-pointer items-center justify-center text-text-muted transition-colors hover:bg-surface-raised hover:text-action focus-visible:-outline-offset-2 md:flex',
        isPrev ? 'border-r border-line' : 'border-l border-line',
      )}>
      <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.25}>
        <path d={isPrev ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="square" />
      </svg>
    </button>
  );
};

export default StepLink;
