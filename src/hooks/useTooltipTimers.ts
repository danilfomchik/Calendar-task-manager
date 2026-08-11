import {PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState} from 'react';

const isTouchOrPen = (e: ReactPointerEvent<Element>) => e.pointerType === 'pen' || e.pointerType === 'touch';

export const useTooltipTimers = (delayMs: number) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const timers = useRef(new Set<NodeJS.Timeout>());

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  }, []);

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, []);

  useEffect(() => {
    return () => clearAll();
  }, [clearAll]);

  const open = useCallback(
    (e: ReactPointerEvent<Element>) => {
      if (isTouchOrPen(e)) return;
      clearAll();
      setIsHovered(true);
      schedule(() => setIsOpened(true), delayMs);
    },
    [clearAll, delayMs, schedule],
  );

  const close = useCallback(
    (e: ReactPointerEvent<Element>) => {
      if (isTouchOrPen(e)) return;
      clearAll();
      schedule(() => {
        setIsOpened(false);
        schedule(() => setIsHovered(false), delayMs);
      }, delayMs);
    },
    [clearAll, delayMs, schedule],
  );

  return {isHovered, isOpened, open, close};
};
