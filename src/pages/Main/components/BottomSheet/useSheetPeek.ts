import {useLayoutEffect, useState} from 'react';

import {remToPx} from '@/services/dom';

import {HOME_HEADER_HEIGHT_MOBILE, MOBILE_GRID_RESERVE, SHEET_PEEK, SHEET_PEEK_MIN} from './constants';

// the constants are px at a 16px root; the layout they budget is in rem, so scale them to the current root font size
const scale = (designPx: number) => remToPx(designPx / 16);

// The height the calendar actually gets: it is sized in 100svh (the viewport with the browser's toolbars shown), which
// can be shorter than window.innerHeight once mobile toolbars collapse. Measured with a probe; a browser without svh
// leaves the probe at 0 and falls back to innerHeight.
const getViewportHeight = () => {
  const probe = document.createElement('div');

  probe.style.cssText = 'position:fixed;top:0;height:100svh;visibility:hidden;pointer-events:none';
  document.body.appendChild(probe);
  const height = probe.offsetHeight;
  probe.remove();

  return height || window.innerHeight;
};

// The six week rows win over the peek: the peek takes what is left once the header and the Month grid fit, never more
// than SHEET_PEEK and never less than the handle. With a raised font size on a very short phone even the handle may not
// leave room for the grid; the handle stays, so the sheet can still be opened.
const getSheetPeek = () => {
  const room = getViewportHeight() - scale(HOME_HEADER_HEIGHT_MOBILE) - scale(MOBILE_GRID_RESERVE);

  return Math.max(scale(SHEET_PEEK_MIN), Math.min(scale(SHEET_PEEK), Math.floor(room)));
};

// Collapsed sheet height, shared by the sheet and the calendar's bottom padding: the full three-row peek where the
// screen allows it, otherwise only what is left once all six week rows fit (375x667 gets about 2 rows, 320x568 the date
// block and most of one row), so the Month grid is never clipped.
// Called once, in Calendar, which passes it to the sheet. Only measures while `isActive` (below md, where the sheet
// lives; 0 otherwise), and at most once a frame while resizing, since each measure forces a layout.
export const useSheetPeek = (isActive: boolean) => {
  const [peek, setPeek] = useState(() => (isActive ? getSheetPeek() : 0));

  // a layout effect, so turning into the mobile layout never paints a frame without the reserved space
  useLayoutEffect(() => {
    if (!isActive) return;

    setPeek(getSheetPeek());

    let frame = 0;
    const handleResize = () => {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;
        setPeek(getSheetPeek());
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frame);
    };
  }, [isActive]);

  return peek;
};
