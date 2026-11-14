import {TIconProps} from '../types';

const CompassIcon = ({className}: TIconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden>
    <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 3.2 L9.6 8 L8 12.8 L6.4 8 Z" fill="currentColor" />
  </svg>
);

export default CompassIcon;
