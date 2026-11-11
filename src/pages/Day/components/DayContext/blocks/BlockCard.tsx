import {PropsWithChildren, ReactNode} from 'react';

import {cx} from '@/services/utils';

type TBlockCardProps = PropsWithChildren<{
  // accessible name of the block (also its region label)
  label: string;
  // the visible header row (block name, extra controls)
  header: ReactNode;
  busy?: boolean;
  // surface, border and min height; skeleton and content of a block share it so the blocks below don't jump
  className: string;
}>;

// The frame every Day context card shares: a labelled section, a header row, then the content stacked with gap-3
export const BlockCard = ({label, header, busy = false, className, children}: TBlockCardProps) => (
  <section aria-label={label} aria-busy={busy} className={cx('flex flex-col gap-3 p-4', className)}>
    {header}
    {children}
  </section>
);

// A pulsing placeholder bar for a card's loading state (static under reduced motion)
export const SkeletonLine = ({className}: {className: string}) => (
  <span aria-hidden className={cx('block animate-pulse bg-surface-overlay motion-reduce:animate-none', className)} />
);
