import {cx} from '@/services/utils';

import {TSkeletonLineProps} from './types';

// A pulsing placeholder bar for a loading state (static under reduced motion)
const SkeletonLine = ({className}: TSkeletonLineProps) => (
  <span aria-hidden className={cx('block animate-pulse bg-surface-overlay progress-pulse', className)} />
);

export default SkeletonLine;
