import {TIconProps} from '../types';

const CrosshairIcon = ({className}: TIconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden>
    <circle cx="8" cy="8" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="8" cy="8" r="1.4" fill="currentColor" />
    <path d="M8 0.5 V3 M8 13 V15.5 M0.5 8 H3 M13 8 H15.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export default CrosshairIcon;
