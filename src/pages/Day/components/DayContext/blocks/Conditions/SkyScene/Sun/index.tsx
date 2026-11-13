import {TSunProps} from './types';

const Sun = ({x, y, glowId}: TSunProps) => (
  <g>
    <circle cx={x} cy={y} r="70" fill={`url(#${glowId})`} />
    <circle cx={x} cy={y} r="17" fill="#ffe2a0" />
  </g>
);

export default Sun;
