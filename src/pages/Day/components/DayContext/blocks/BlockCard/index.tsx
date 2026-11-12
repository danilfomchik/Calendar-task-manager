import {cx} from '@/services/utils';

import {TBlockCardProps, TSkeletonLineProps} from './types';

// The frame every Day context card shares: a labelled section, a header row, then the content stacked with gap-3
export const BlockCard = ({label, header, busy = false, className, children}: TBlockCardProps) => (
  <section aria-label={label} aria-busy={busy} className={cx('flex flex-col gap-3 p-4', className)}>
    {header}
    {children}
  </section>
);

// A pulsing placeholder bar for a card's loading state (static under reduced motion)
export const SkeletonLine = ({className}: TSkeletonLineProps) => (
  <span aria-hidden className={cx('block animate-pulse bg-surface-overlay motion-reduce:animate-none', className)} />
);
