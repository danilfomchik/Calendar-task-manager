import {animate, motion, useDragControls, useMotionValue, useReducedMotion} from 'motion/react';
import {PointerEvent, useEffect, useLayoutEffect, useRef} from 'react';

import {cx} from '@/services/utils';

import DayContextBlocks from './DayContextBlocks';
import {useDayContext} from './DayContextState';
import {DAY_CONTEXT_BUTTON_ID, DAY_CONTEXT_SHEET_ID} from './constants';
import {inertProps} from './helpers';
import {PanelBottomIcon} from './icons';

const FLICK_VELOCITY = 250;
// a click right after a drag is the tail of that same gesture, not a tap
const CLICK_AFTER_DRAG_WINDOW_MS = 150;
const TRANSITION = {type: 'tween', duration: 0.25, ease: 'easeOut'} as const;

// Mobile Bottom sheet with the drawer's blocks. Closes on Esc, backdrop and a downward drag; inert while closed.
const DayContextSheet = ({date}: {date: string}) => {
  const {isSheetOpen, closeSheet} = useDayContext();
  const shouldReduceMotion = useReducedMotion();
  const dragControls = useDragControls();

  const layerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpenRef = useRef(isSheetOpen);
  const lastDragEndRef = useRef(0);
  // closed = pushed down by the whole layer (viewport) height, so it never peeks whatever its content height
  const y = useMotionValue(typeof window === 'undefined' ? 0 : window.innerHeight);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const observer = new ResizeObserver(() => {
      if (!isOpenRef.current) y.set(layer.clientHeight);
    });
    observer.observe(layer);

    return () => observer.disconnect();
  }, [y]);

  useEffect(() => {
    isOpenRef.current = isSheetOpen;
    const target = isSheetOpen ? 0 : (layerRef.current?.clientHeight ?? window.innerHeight);
    const controls = animate(y, target, shouldReduceMotion ? {duration: 0} : TRANSITION);

    if (isSheetOpen) {
      closeButtonRef.current?.focus();
    } else if (sheetRef.current?.contains(document.activeElement)) {
      document.getElementById(DAY_CONTEXT_BUTTON_ID)?.focus();
    }

    return () => controls.stop();
  }, [isSheetOpen, shouldReduceMotion, y]);

  useEffect(() => {
    if (!isSheetOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSheet();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isSheetOpen, closeSheet]);

  const startDrag = (e: PointerEvent) => dragControls.start(e);

  return (
    <div
      ref={layerRef}
      className={cx('fixed inset-0 z-40 overflow-hidden md:hidden', {'pointer-events-none': !isSheetOpen})}>
      <motion.div
        aria-hidden
        onClick={closeSheet}
        initial={false}
        animate={{opacity: isSheetOpen ? 1 : 0}}
        transition={shouldReduceMotion ? {duration: 0} : TRANSITION}
        className="absolute inset-0 bg-surface-sunken/80"
      />

      <motion.section
        ref={sheetRef}
        id={DAY_CONTEXT_SHEET_ID}
        role="dialog"
        aria-label="Day context"
        {...inertProps(!isSheetOpen)}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={{top: 0, bottom: 0.6}}
        dragConstraints={{top: 0, bottom: 0}}
        onDragEnd={(_, info) => {
          lastDragEndRef.current = performance.now();
          const height = sheetRef.current?.offsetHeight ?? 0;

          if (info.velocity.y > FLICK_VELOCITY || info.offset.y > height / 3) closeSheet();
          else animate(y, 0, shouldReduceMotion ? {duration: 0} : TRANSITION);
        }}
        style={{y}}
        className="absolute inset-x-0 bottom-0 flex max-h-[85%] flex-col border-t border-line-strong bg-surface-base shadow-lg">
        <div onPointerDown={startDrag} className="shrink-0 cursor-grab touch-none">
          <span aria-hidden className="mx-auto mt-2 block h-1 w-10 bg-line-strong" />
          <div className="flex items-center justify-between gap-3 pl-4">
            <h2 className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-action uppercase">
              <PanelBottomIcon />
              Day context
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => {
                if (performance.now() - lastDragEndRef.current < CLICK_AFTER_DRAG_WINDOW_MS) return;
                closeSheet();
              }}
              className="flex min-h-11 cursor-pointer items-center px-4 font-mono text-xs tracking-wider text-text-muted uppercase hover:text-text">
              Close
            </button>
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto overscroll-contain px-3 pb-6">
          <DayContextBlocks date={date} />
        </div>
      </motion.section>
    </div>
  );
};

export default DayContextSheet;
