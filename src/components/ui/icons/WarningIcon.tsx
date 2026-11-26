import {IconProps} from './types';

// A warning triangle with an exclamation mark, for error rows
const WarningIcon = ({size, ...restProps}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden
    className={size}
    {...restProps}>
    <path strokeLinejoin="round" d="M12 3.75 21.25 20H2.75L12 3.75Z" />
    <path strokeLinecap="round" d="M12 10v4.5M12 17.25v.01" />
  </svg>
);

export default WarningIcon;
