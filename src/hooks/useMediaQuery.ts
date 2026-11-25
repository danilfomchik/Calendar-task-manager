import {TScreenSizes} from '@/types/types';

import {useMatchMedia} from './useMatchMedia';

type TMediaQueryDirection = 'to' | 'from';

interface IUseMediaQuery {
  size: TScreenSizes;
  direction: TMediaQueryDirection;
}

// Tailwind's default breakpoints: where each size starts, in px
const SIZE_START: Record<IUseMediaQuery['size'], number> = {xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536};
const SIZES = Object.keys(SIZE_START) as IUseMediaQuery['size'][];

const toQuery = ({size, direction}: IUseMediaQuery) => {
  if (direction === 'from') return `(min-width: ${SIZE_START[size]}px)`;

  const next = SIZES[SIZES.indexOf(size) + 1];

  return next ? `(max-width: ${SIZE_START[next] - 0.02}px)` : 'all';
};

// Whether the viewport is in a Tailwind breakpoint range: 'to' = up to and including `size` (e.g. sm → below md),
// 'from' = `size` and up (like the `md:` prefix)
export const useMediaQuery = (params: IUseMediaQuery) => useMatchMedia(toQuery(params));
