import {TCalloutFactProps} from './types';

// The Day page block's "Did you know" callout; `relative` lifts it above the card's absolutely positioned glows
const CalloutFact = ({fact}: TCalloutFactProps) => (
  <div className="relative border-l-2 border-action bg-action/10 p-3">
    <span className="font-mono text-[10px] tracking-widest text-action uppercase">Did you know</span>
    <p className="mt-1 text-sm leading-relaxed">{fact}</p>
  </div>
);

export default CalloutFact;
