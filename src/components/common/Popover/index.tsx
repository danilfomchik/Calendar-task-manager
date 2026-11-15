import {motion, useReducedMotion} from 'motion/react';
import {useEffect, useLayoutEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import {useSelector} from 'react-redux';

import {selectOpenedItems} from '@/redux/overflow/selectors';
import {cx, stopPropagation} from '@/services/utils';

import {claimActivePopover, releaseActivePopover} from './activePopover';
import {TPopoverProps} from './types';
import {usePopoverPosition} from './usePopoverPosition';

// Non-modal dialog anchored to a trigger. Portalled to <body> so a clipping parent (the Bottom sheet) cannot cut it
// off; z-900 keeps it above sheets and the sidebar but under modals (z-1000), and it closes as soon as a modal opens.
// Closes on outside pointer-down, Esc and when another popover opens; the caller also closes it when its context
// changes (e.g. the selected date). Focus moves into it on open and back to the trigger on every close: Esc, an
// outside click, the trigger toggled, the date changed. The one exception is a close caused by focus itself moving
// to another control (tabbing out, clicking a field such as the Day note row): pulling it back would undo that.
// If the trigger has been removed by then, focus goes to fallbackFocusRef instead.
const Popover = ({
  isOpen,
  anchorRef,
  fallbackFocusRef,
  onClose,
  label,
  id,
  width = 340,
  className,
  children,
}: TPopoverProps) => {
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
    const fallback = fallbackFocusRef?.current;

    return () => {
      releaseActivePopover(close);
      // Deferred until the pointer-down that closed it has moved focus (to a clicked field, or to <body>). By then
      // the panel is gone, so focus that was inside it has dropped to <body> too.
      window.setTimeout(() => {
        const active = document.activeElement;
        const hasMovedElsewhere = !!active && active !== document.body && active.isConnected;
        if (hasMovedElsewhere) return;

        const target = anchor?.isConnected ? anchor : fallback;
        target?.focus({preventScroll: true});
      }, 0);
    };
  }, [isOpen, anchorRef, fallbackFocusRef]);

  useEffect(() => {
    if (!isOpen) return;

    const isInside = (target: EventTarget | null) =>
      target instanceof Node && (!!panelRef.current?.contains(target) || !!anchorRef.current?.contains(target));

    const onPointerDown = (e: PointerEvent) => {
      if (!isInside(e.target)) onCloseRef.current();
    };
    // capture on window, before the Agenda panel / sheet / modal Esc handlers, so Esc closes only the popover
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      onCloseRef.current();
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!isInside(e.target)) onCloseRef.current();
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
      onPointerDown={stopPropagation}
      onClick={stopPropagation}
      style={
        position
          ? {top: position.top, left: position.left, width: position.width, maxHeight: position.maxHeight}
          : {top: 0, left: 0, width, visibility: 'hidden'}
      }
      // focus shows as a green border on the panel and a 1px green ring on anything focusable inside, not the
      // global outline
      className={cx(
        'fixed z-900 overflow-y-auto overscroll-contain border border-line-strong bg-surface-overlay p-4 shadow-[0_12px_32px_rgba(0,0,0,0.55)] transition-colors focus-visible:border-action focus-visible:outline-none! [&_*:focus-visible]:shadow-[0_0_0_1px_var(--color-action)] [&_*:focus-visible]:outline-none!',
        className,
      )}>
      {children}
    </motion.div>,
    document.body,
  );
};

export default Popover;
