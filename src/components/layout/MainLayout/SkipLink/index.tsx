import {MouseEvent} from 'react';

import {MONTH_GRID_ID} from '../constants';

// The page's first Tab stop on Home, hidden until focused: jumps past the sidebar and header to the Month grid.
// Focus is moved by hand rather than through the URL hash, which the router would treat as a navigation.
const SkipLink = () => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(MONTH_GRID_ID);
    if (!target) return;

    e.preventDefault();
    target.focus({preventScroll: true});
    target.scrollIntoView({block: 'start'});
  };

  return (
    <a
      href={`#${MONTH_GRID_ID}`}
      onClick={handleClick}
      className="fixed top-3 left-3 z-1100 -translate-y-[calc(100%+1rem)] border border-line-strong bg-surface-raised px-3 py-2.5 text-para-s text-text shadow-float focus:translate-y-0">
      Skip to calendar
    </a>
  );
};

export default SkipLink;
