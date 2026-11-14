import {PropsWithChildren, RefObject} from 'react';

export type TPopoverProps = PropsWithChildren<{
  isOpen: boolean;
  // The trigger: the popover is anchored to it and focus returns to it on close
  anchorRef: RefObject<HTMLElement>;
  // Called on outside pointer-down, Esc, a modal opening or another popover opening; the caller sets isOpen false
  onClose: () => void;
  // Accessible name of the dialog
  label: string;
  // id for the dialog, so the trigger can point at it with aria-controls
  id?: string;
  // Desktop width in px, capped to the visible viewport width
  width?: number;
  className?: string;
}>;
