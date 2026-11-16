import {DragControls} from 'motion/react';
import {PointerEvent, ReactNode} from 'react';

// What the sheet hands to its content, so the content can build its own handle, header and buttons
export type TSheetApi = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  // Begins dragging the sheet from a pointerdown on a handle or header (give that element `touch-none`)
  startDrag: (e: PointerEvent) => void;
  // Wraps a click handler so the click that ends a drag is ignored instead of being taken as a tap
  guardClick: (handler: () => void) => () => void;
};

export type TSheetProps = {
  id?: string;
  label: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  // Height (px) that stays visible while closed. 0 hides the sheet completely: it becomes inert and the page
  // brings its own trigger. A peeking sheet stays interactive and is opened by dragging or tapping its handle.
  peek?: number;
  // Adds a backdrop that closes the sheet on tap and on Esc (unless isEscapeDisabled), and makes the
  // open sheet a dialog
  modal?: boolean;
  // Space (px) left above the open sheet, default SHEET_DEFAULT_TOP_GAP; raise it when the layer also covers something the sheet should
  // stay below (e.g. a header)
  topGap?: number;
  // Ignore Esc, e.g. while a modal or menu opened on top handles its own
  isEscapeDisabled?: boolean;
  // Drag controls owned by the page, so a trigger outside the sheet (e.g. a peeking button) can start dragging it
  dragControls?: DragControls;
  // Positions the layer the sheet slides in (default fills the nearest positioned ancestor); add z-index and
  // visibility classes here
  layerClassName?: string;
  // Surface look of the sheet itself: background, shadow
  className?: string;
  children: (api: TSheetApi) => ReactNode;
};
