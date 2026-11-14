import {RefObject, useLayoutEffect, useState} from 'react';

const GAP = 6;
const MARGIN = 8;

export type TPopoverPosition = {top: number; left: number; width: number; maxHeight: number};

// Anchors the panel under the trigger, right-aligned, inside the visible part of the screen. Works in layout
// viewport coordinates (what position: fixed uses) but clamps to the visual viewport, so a pinch-zoom or the mobile
// keyboard never hides it. Flips above the trigger when it does not fit below and there is more room above; when
// neither side fits, maxHeight caps it on the roomier side and the panel scrolls.
export const usePopoverPosition = (
  isOpen: boolean,
  anchorRef: RefObject<HTMLElement>,
  panelRef: RefObject<HTMLElement>,
  width: number,
) => {
  const [position, setPosition] = useState<TPopoverPosition | null>(null);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const place = () => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor || !panel) return;

      const vv = window.visualViewport;
      const viewTop = vv?.offsetTop ?? 0;
      const viewLeft = vv?.offsetLeft ?? 0;
      const viewHeight = vv?.height ?? window.innerHeight;
      const viewWidth = vv?.width ?? window.innerWidth;

      const rect = anchor.getBoundingClientRect();
      const panelWidth = Math.min(width, viewWidth - MARGIN * 2);
      const minLeft = viewLeft + MARGIN;
      const maxLeft = viewLeft + viewWidth - MARGIN - panelWidth;
      const left = Math.min(Math.max(minLeft, rect.right - panelWidth), maxLeft);

      const spaceBelow = viewTop + viewHeight - MARGIN - (rect.bottom + GAP);
      const spaceAbove = rect.top - GAP - (viewTop + MARGIN);
      // full content height even while capped by maxHeight, plus the borders scrollHeight leaves out
      const height = panel.scrollHeight + panel.offsetHeight - panel.clientHeight;
      const isAbove = height > spaceBelow && spaceAbove > spaceBelow;
      const maxHeight = Math.max(0, isAbove ? spaceAbove : spaceBelow);
      const shownHeight = Math.min(height, maxHeight);
      const top = isAbove ? rect.top - GAP - shownHeight : rect.bottom + GAP;

      setPosition(prev =>
        prev && prev.top === top && prev.left === left && prev.width === panelWidth && prev.maxHeight === maxHeight
          ? prev
          : {top, left, width: panelWidth, maxHeight},
      );
    };

    place();

    const observer = new ResizeObserver(place);
    if (panelRef.current) observer.observe(panelRef.current);
    if (anchorRef.current) observer.observe(anchorRef.current);
    window.addEventListener('resize', place);
    // capture: any scrolling ancestor of the trigger moves it
    window.addEventListener('scroll', place, true);
    window.visualViewport?.addEventListener('resize', place);
    window.visualViewport?.addEventListener('scroll', place);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      window.visualViewport?.removeEventListener('resize', place);
      window.visualViewport?.removeEventListener('scroll', place);
    };
  }, [isOpen, anchorRef, panelRef, width]);

  // a stale position from the last opening is replaced before paint by the layout effect
  return isOpen ? position : null;
};
