import {TFactProps} from './types';

const Fact = ({term, children}: TFactProps) => (
  <div className="flex justify-between gap-2 border-b border-line py-1">
    <dt className="text-text-faint">{term}</dt>
    <dd className="text-right text-text-muted">{children}</dd>
  </div>
);

export default Fact;
