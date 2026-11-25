import {RefObject, useLayoutEffect} from 'react';

// Calls `measure` with the element before paint and again whenever it resizes (a font size change included, since
// rem-based layouts resize the element with the new size in effect). Wrap `measure` in useCallback: a new function
// re-measures at once, so its dependencies are the inputs that change the result. `isEnabled: false` stops observing.
export const useMeasure = <T extends Element>(
  ref: RefObject<T | null>,
  measure: (element: T) => void,
  isEnabled = true,
) => {
  useLayoutEffect(() => {
    const element = ref.current;

    if (!isEnabled || !element) return;

    const run = () => measure(element);

    run();

    const observer = new ResizeObserver(run);
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, measure, isEnabled]);
};
