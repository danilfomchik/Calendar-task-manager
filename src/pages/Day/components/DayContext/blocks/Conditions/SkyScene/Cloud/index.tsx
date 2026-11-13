import {TCloudProps} from './types';

const Cloud = ({x, y, scale, fill, opacity = 1, drift}: TCloudProps) => (
  <g className="sky-drift" style={{animationDuration: `${drift}s`}}>
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={fill} opacity={opacity}>
      <circle cx="0" cy="0" r="18" />
      <circle cx="22" cy="-11" r="23" />
      <circle cx="46" cy="-1" r="17" />
      <rect x="-18" y="0" width="82" height="17" rx="8.5" />
    </g>
  </g>
);

export default Cloud;
