import {cx} from '@/services/utils';

import {BlockCard} from '../../BlockCard';
import {TConditionsFrameProps} from './types';

// Skeleton and content share a minimum so the blocks below don't jump when the data arrives
const CARD_MIN_HEIGHT = 'min-h-68';

const ConditionsFrame = ({children, label, busy = false}: TConditionsFrameProps) => (
  <BlockCard
    label="Conditions"
    busy={busy}
    className={cx('border border-info/40 bg-linear-to-br from-info/25 via-info/10 to-transparent', CARD_MIN_HEIGHT)}
    header={
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] tracking-widest text-info uppercase">Conditions</span>
        {label}
      </div>
    }>
    {children}
  </BlockCard>
);

export default ConditionsFrame;
