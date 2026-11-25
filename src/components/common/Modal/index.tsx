import {motion, useReducedMotion} from 'motion/react';
import {KeyboardEvent, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';

import {cx} from '@/services/utils';

import {FOCUSABLE_SELECTOR} from './constants';
import {TModalProps} from './types';

// A square, raised dialog over a dimmed backdrop: centred from sm, a full-width sheet on the bottom edge below it.
// Focus stays inside while it is open and returns to the control that opened it when it closes; Escape is handled by
// the overflow stack (useOpeningItem) so only the topmost layer closes.
const Modal = ({refItem, labelledBy, className, children, onClose}: TModalProps) => {
  const reduceMotion = useReducedMotion();

  // The control that opened the dialog, read while the dialog first renders: a child's autoFocus (the event form's
  // title) or mount effect moves focus before this component's own effects run, so reading it in an effect would record
  // that child and focus would be dropped on close
  const [opener] = useState(() => document.activeElement as HTMLElement | null);

  // only when focus went down with the dialog, never taking it back from a control that claimed it on close
  useEffect(() => {
    return () => {
      const isFocusDropped = !document.activeElement || document.activeElement === document.body;

      if (isFocusDropped && opener?.isConnected) opener.focus({preventScroll: true});
    };
  }, [opener]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (refItem?.current?.contains(e.target as Node)) return;

    onClose();
  };

  // keeps Tab and Shift+Tab cycling inside the dialog
  const trapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !refItem.current) return;

    const focusable = Array.from(refItem.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) return;

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className={cx(
        'fixed inset-0 z-1000 flex items-end justify-center bg-surface-sunken/85 sm:items-center',
        className,
      )}>
      <motion.div
        ref={refItem}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onKeyDown={trapFocus}
        initial={reduceMotion ? false : {opacity: 0, y: 12}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
        className="relative max-h-[calc(100svh-2rem)] w-full overflow-y-auto border-t border-line-strong bg-surface-raised shadow-modal sm:w-md sm:border">
        {children}
      </motion.div>
    </div>,
    document.body,
  );
};

export default Modal;
