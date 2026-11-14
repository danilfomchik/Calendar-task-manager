import {IconProps} from './types';

// A note sheet with a folded corner and two text lines
const NoteIcon = ({size, ...restProps}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden
    className={size}
    {...restProps}>
    <path strokeLinejoin="round" d="M5 3.75h9.5L19 8.25v12H5v-16.5Z" />
    <path strokeLinejoin="round" d="M14.5 3.75v4.5H19" />
    <path strokeLinecap="round" d="M8.5 12.5h7M8.5 16h4.5" />
  </svg>
);

export default NoteIcon;
