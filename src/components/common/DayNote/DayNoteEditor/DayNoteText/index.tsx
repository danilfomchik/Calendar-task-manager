import {MouseEvent, useLayoutEffect, useRef, useState} from 'react';

import {cx} from '@/services/utils';

import {COLLAPSED_LINES, MAX_ROWS} from '../constants';
import {TDayNoteTextProps} from './types';

// The Day note while it is not being edited: the text clamped to 2 lines with an ellipsis, and a Show more / Show less
// toggle that exists only when the text is longer than that. Expanded, it shows up to MAX_ROWS lines (like the editor)
// and scrolls beyond, so a long note never pushes the Agenda panel or Bottom sheet footer past the screen. Clicking
// the text itself starts editing.
// The character offset in the text under a point, or null when the point is not over the text (or for a keyboard
// activation, which has no position). Offsets count into the full text even where the clamp hides it.
const getOffsetAtPoint = (el: HTMLElement, x: number, y: number): number | null => {
  let node: Node | null = null;
  let offset = 0;

  if (document.caretRangeFromPoint) {
    const range = document.caretRangeFromPoint(x, y);
    node = range?.startContainer ?? null;
    offset = range?.startOffset ?? 0;
  } else {
    // Firefox: the standard API, missing from the TypeScript DOM lib
    const position = (
      document as unknown as {
        caretPositionFromPoint?: (x: number, y: number) => {offsetNode: Node; offset: number} | null;
      }
    ).caretPositionFromPoint?.(x, y);
    node = position?.offsetNode ?? null;
    offset = position?.offset ?? 0;
  }

  return node && el.contains(node) && node.nodeType === Node.TEXT_NODE ? offset : null;
};

const DayNoteText = ({text, onEdit}: TDayNoteTextProps) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // scrollHeight is the full text height even while clamped, so this works in both states; re-measured when the width
  // changes, because that changes the wrapping
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      setIsOverflowing(el.scrollHeight > lineHeight * COLLAPSED_LINES + 1);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, [text]);

  return (
    <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
      {/* The scroll box wraps the button, not the other way round, so a long expanded note scrolls without a nested
      interactive scroller. It carries the text style (the button inherits it), so its max height of MAX_ROWS `lh` is
      MAX_ROWS of the note's own lines at either size. */}
      <div
        style={isExpanded ? {maxHeight: `${MAX_ROWS}lh`} : undefined}
        className={cx('w-full text-para-m md:text-para-s', isExpanded && 'overflow-y-auto overscroll-contain')}>
        {/* `block`: an inline-block button would sit on a line box of the wrapper's own (taller) line height and make a
        one-line note taller than the empty "Add a note" row.
        The clamp sits on an inner span: buttons do not reliably honour -webkit-line-clamp. The note text stays the
      button's content (no aria-label) so screen readers read it, after a hidden "Edit day note:" prefix. */}
        <button
          type="button"
          onClick={(e: MouseEvent) =>
            onEdit(e.detail > 0 && textRef.current ? getOffsetAtPoint(textRef.current, e.clientX, e.clientY) : null)
          }
          className="block w-full cursor-text text-left text-text focus-visible:outline-offset-0!">
          <span className="sr-only">Edit day note: </span>
          <span
            ref={textRef}
            className={cx('wrap-anywhere whitespace-pre-wrap', isExpanded ? 'block' : 'line-clamp-2')}>
            {text}
          </span>
        </button>
      </div>

      {isOverflowing && (
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded(expanded => !expanded)}
          className="cursor-pointer text-caption text-text-faint transition-colors hover:text-action focus-visible:text-action motion-reduce:transition-none">
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default DayNoteText;
