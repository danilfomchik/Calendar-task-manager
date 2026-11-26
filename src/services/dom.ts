import {SyntheticEvent} from 'react';

// For handlers that only keep an event from reaching ancestors (a draggable sheet, a clickable row)
export const stopPropagation = (event: SyntheticEvent) => event.stopPropagation();

// React 18's typings lack `inert`; an empty string sets the attribute, omitting it removes it
export const inertProps = (isInert: boolean) => (isInert ? ({inert: ''} as Record<string, string>) : {});

// True for a text field or editable element, where single-key shortcuts and Escape belong to the field
export const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;

  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
};

// The root font size in px: 16 by default, larger when the user raises the browser's default font size. Sizes set in
// rem scale with it, so JS layout maths that mirrors them (chip capacity, the Bottom sheet's peek) converts through it
export const remToPx = (rem: number) => rem * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
