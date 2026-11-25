import {useMatchMedia} from '@/hooks/useMatchMedia';

// Whether the primary pointer is a finger (a touch tablet in the desktop layout), not a mouse or trackpad. Follows a
// change live, e.g. a tablet docked to a keyboard and trackpad.
export const useCoarsePointer = () => useMatchMedia('(pointer: coarse)');
