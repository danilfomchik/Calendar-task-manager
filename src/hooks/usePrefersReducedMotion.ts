import {useMatchMedia} from './useMatchMedia';

// The OS reduced-motion setting, followed live. For script-driven motion (e.g. smooth scrolling) outside `motion`, so a
// component that only needs the flag does not pull the `motion` library in; CSS animations get it from index.css.
export const usePrefersReducedMotion = () => useMatchMedia('(prefers-reduced-motion: reduce)');
