import {BlockCard} from '../../BlockCard';
import {TConditionsFrameProps} from './types';

// The frame every Conditions state shares: a quiet raised card, the block name, and a control on the right
const ConditionsFrame = ({children, label, busy = false}: TConditionsFrameProps) => (
  <BlockCard
    label="Conditions"
    busy={busy}
    className="border border-line bg-surface-raised"
    header={
      <div className="flex min-h-7 items-center justify-between gap-2">
        <span className="font-mono text-[10px] tracking-widest text-info uppercase">Conditions</span>
        {label}
      </div>
    }>
    {children}
  </BlockCard>
);

export default ConditionsFrame;
