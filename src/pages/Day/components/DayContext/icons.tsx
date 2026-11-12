import {SVGProps} from 'react';

// Small 16px line icons of the Day context (stroke follows the text colour)
const Svg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    aria-hidden
    {...props}
  />
);

// Side panel: the right rail is filled while the drawer is open
export const PanelRightIcon = ({isFilled, ...props}: SVGProps<SVGSVGElement> & {isFilled?: boolean}) => (
  <Svg {...props}>
    <rect x="1.75" y="2.75" width="12.5" height="10.5" />
    <path d="M10 2.75v10.5" />
    {isFilled && <rect x="10" y="3.5" width="3.5" height="9" fill="currentColor" stroke="none" />}
  </Svg>
);

// Sheet: the bottom rail is filled while the sheet is open (used as the closed button's mark)
export const PanelBottomIcon = (props: SVGProps<SVGSVGElement>) => (
  <Svg {...props}>
    <rect x="1.75" y="2.75" width="12.5" height="10.5" />
    <path d="M1.75 9h12.5" />
  </Svg>
);

export const NoteIcon = (props: SVGProps<SVGSVGElement>) => (
  <Svg {...props}>
    <path d="M3 2.75h7.5L13 5.25v8H3z" />
    <path d="M5.5 7.5h5M5.5 10.25h3.5" />
  </Svg>
);

export const InsightIcon = (props: SVGProps<SVGSVGElement>) => (
  <Svg {...props} strokeLinejoin="round">
    <path d="M8 1.75c.4 3.2 1.4 4.6 5.25 6.25C9.4 9.65 8.4 11.05 8 14.25 7.6 11.05 6.6 9.65 2.75 8 6.6 6.35 7.6 4.95 8 1.75z" />
  </Svg>
);
