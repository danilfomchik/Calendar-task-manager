import {motion, useReducedMotion} from 'motion/react';
import {useEffect, useLayoutEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import {useSelector} from 'react-redux';

import {selectOpenedItems} from '@/redux/overflow/selectors';
import {cx} from '@/services/utils';

import {claimActivePopover, releaseActivePopover} from './activePopover';
import {TPopoverProps} from './types';
import {usePopoverPosition} from './usePopoverPosition';

// Non-modal dialog anchored to a trigger. Portalled to <body> so a clipping parent (the Bottom sheet) cannot cut it
// off; z-900 keeps it above sheets and the sidebar but under modals (z-1000), and it closes as soon as a modal opens.
// Closes on outside pointer-down, Esc and when another popover opens; the caller also closes it when its context
// changes (e.g. the selected date). Focus moves into it on open and back to the trigger on close, unless the user
// has already put focus somewhere else (clicked a field, tabbed away).
const Popover = ({isOpen, anchorRef, onClose, label, id, width = 340, className, children}: TPopoverProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const position = usePopoverPosition(isOpen, anchorRef, panelRef, width);
  const openedItems = useSelector(selectOpenedItems);

  // latest onClose without re-running the listeners below when the caller passes a new function
  const onCloseRef = useRef(onClose);
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  // one popover at a time, plus focus in on open and back to the trigger on every close
  useEffect(() => {
    if (!isOpen) return;

    const close = () => onCloseRef.current();
    claimActivePopover(close);
    panelRef.current?.focus({preventScroll: true});

    const anchor = anchorRef.current;

    return () => {
      releaseActivePopover(close);
      // after the pointer-down that closed it has moved focus (to a clicked field, or to <body>)
      window.setTimeout(() => {
        const active = document.activeElement;
        if ((!active || active === document.body) && anchor?.isConnected) anchor.focus({preventScroll: true});
      }, 0);
    };
  }, [isOpen, anchorRef]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      onCloseRef.current();
    };
    // capture on window, before the Agenda panel / sheet / modal Esc handlers, so Esc closes only the popover
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      onCloseRef.current();
    };
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      onCloseRef.current();
    };

    // capture: a container that stops pointerdown in React (the Bottom sheet's note block) also stops the native
    // event bubbling to document, so a bubble listener would miss taps there
    document.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusin', onFocusIn);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [isOpen, anchorRef]);

  // a modal (or any overflow item) opening on top closes the popover instead of leaving it under the backdrop
  const prevOpenedItems = useRef(openedItems);
  useEffect(() => {
    if (isOpen && openedItems > prevOpenedItems.current) onCloseRef.current();
    prevOpenedItems.current = openedItems;
  }, [isOpen, openedItems]);

  if (!isOpen) return null;

  return createPortal(
    <motion.div
      ref={panelRef}
      id={id}
      role="dialog"
      aria-label={label}
      tabIndex={-1}
      initial={reduceMotion ? false : {opacity: 0, y: -4}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.14, ease: 'easeOut'}}
      // React events bubble through portals: keep pointer-downs and clicks from reaching the trigger's ancestors
      // (a draggable sheet, a clickable row)
      onPointerDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
      style={
        position
          ? {top: position.top, left: position.left, width: position.width, maxHeight: position.maxHeight}
          : {top: 0, left: 0, width, visibility: 'hidden'}
      }
      className={cx(
        'fixed z-900 overflow-y-auto overscroll-contain border border-line-strong bg-surface-overlay p-4 shadow-[0_12px_32px_rgba(0,0,0,0.55)] transition-colors focus-visible:border-action focus-visible:outline-none! [&_*:focus-visible]:outline-none!',
        className,
      )}>
      {children}
    </motion.div>,
    document.body,
  );
};

export default Popover;
