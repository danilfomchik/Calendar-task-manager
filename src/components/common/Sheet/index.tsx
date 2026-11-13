import {
  AnimationPlaybackControls,
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';

import {cx, inertProps} from '@/services/utils';

import {TSheetApi, TSheetProps} from './types';

const FLICK_VELOCITY = 250;
// a click right after a drag is the tail of that same gesture, not a tap
const CLICK_AFTER_DRAG_WINDOW_MS = 150;
// Space left above the open sheet
const TOP_GAP = 72;
const SPRING = {type: 'spring', stiffness: 500, damping: 42, mass: 0.8} as const;

// Mobile bottom sheet: a layer filling its positioned ancestor with a sheet that slides between open (flush to the
// top gap) and closed (`peek` px visible, or hidden). Dragging follows the finger and settles by flick or by half
// way, with a spring. Controlled by `isOpen`; the content is a render prop so it can lay out its own handle/header.
const Sheet = ({
  id,
  label,
  isOpen,
  onOpenChange,
  peek = 0,
  modal = false,
  layerClassName,
  className,
  children,
}: TSheetProps) => {
  const shouldReduceMotion = useReducedMotion();
  const dragControls = useDragControls();

  const layerRef = useRef<HTMLDivElement>(null);
  const [layerHeight, setLayerHeight] = useState(0);
  const y = useMotionValue(0);
  // the state the sheet has been sent to, so a prop change that only echoes our own settle doesn't re-animate
  const settledRef = useRef(isOpen);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const lastDragEndRef = useRef(0);

  useLayoutEffect(() => {
    const el = layerRef.current;
    if (!el) return;

    const measure = () => setLayerHeight(el.clientHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const sheetHeight = Math.max(layerHeight - TOP_GAP, peek + 40);
  const collapsedY = sheetHeight - peek;

  const animateTo = useCallback(
    (open: boolean) => {
      animationRef.current?.stop();
      animationRef.current = animate(y, open ? 0 : collapsedY, shouldReduceMotion ? {duration: 0} : SPRING);
    },
    [collapsedY, shouldReduceMotion, y],
  );

  // place without animating on first measure / resize; before paint, so a closed sheet never flashes open
  useLayoutEffect(() => {
    animationRef.current?.stop();
    y.set(settledRef.current ? 0 : collapsedY);
  }, [collapsedY, y]);

  // opened or closed from outside (a trigger button, a route change)
  useEffect(() => {
    if (isOpen === settledRef.current) return;

    settledRef.current = isOpen;
    animateTo(isOpen);
  }, [isOpen, animateTo]);

  const settle = useCallback(
    (open: boolean) => {
      settledRef.current = open;
      animateTo(open);
      onOpenChange(open);
    },
    [animateTo, onOpenChange],
  );

  useEffect(() => {
    if (!modal || !isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') settle(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [modal, isOpen, settle]);

  // The backdrop follows the sheet, so it fades with the slide and with the finger
  const backdropOpacity = useTransform(y, [collapsedY, 0], [0, 1]);

  const api: TSheetApi = {
    isOpen,
    toggle: () => settle(!isOpen),
    close: () => settle(false),
    startDrag: e => dragControls.start(e),
    guardClick: handler => () => {
      if (performance.now() - lastDragEndRef.current < CLICK_AFTER_DRAG_WINDOW_MS) return;

      handler();
    },
  };

  return (
    <div ref={layerRef} className={cx('pointer-events-none absolute inset-0 overflow-hidden', layerClassName)}>
      {layerHeight > 0 && (
        <>
          {modal && (
            <motion.div
              aria-hidden
              onClick={() => settle(false)}
              style={{opacity: backdropOpacity}}
              className={cx('absolute inset-0 bg-surface-sunken/80', {'pointer-events-auto': isOpen})}
            />
          )}

          <motion.section
            id={id}
            role={modal ? 'dialog' : undefined}
            aria-label={label}
            {...inertProps(modal && !isOpen && peek === 0)}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0.05}
            dragConstraints={{top: 0, bottom: collapsedY}}
            onDragEnd={(_, info) => {
              lastDragEndRef.current = performance.now();

              if (info.velocity.y < -FLICK_VELOCITY) settle(true);
              else if (info.velocity.y > FLICK_VELOCITY) settle(false);
              else settle(y.get() < collapsedY / 2);
            }}
            style={{y, height: sheetHeight}}
            className={cx(
              'pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col border-t border-line-strong',
              className,
            )}>
            {children(api)}
          </motion.section>
        </>
      )}
    </div>
  );
};

export default Sheet;
