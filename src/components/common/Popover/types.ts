import {PropsWithChildren, RefObject} from 'react';

export type TPopoverProps = PropsWithChildren<{
  isOpen: boolean;
  // The trigger: the popover is anchored to it and focus returns to it on close
  anchorRef: RefObject<HTMLElement>;
  // Focused on close instead of the trigger when the trigger is no longer in the document (e.g. replaced by a
  // loading state); a stable, focusable element next to where the trigger was, mounted for as long as the popover
  // is open (it is read when the popover opens)
  fallbackFocusRef?: RefObject<HTMLElement>;
  // Called on outside pointer-down, Esc, a modal opening or another popover opening; the caller sets isOpen false
  onClose: () => void;
  // Accessible name of the dialog
  label: string;
  // id for the dialog, so the trigger can point at it with aria-controls
  id?: string;
  // Desktop width in px, capped to the visible viewport width. Below a 640px layout viewport every popover is full
  // width with a 16px inset whatever this is (a deliberate rule: phones get edge-to-edge panels)
  width?: number;
  className?: string;
}>;
