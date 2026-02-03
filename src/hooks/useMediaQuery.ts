import {TScreenSizes} from '@/services/types';

import {useScreenSize} from './useScreenSize';

type TMediaQueryDirection = 'to' | 'from';

interface IUseMediaQuery {
  size: TScreenSizes;
  direction: TMediaQueryDirection;
}

const screenSizes: TScreenSizes[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

export const useMediaQuery = ({size, direction}: IUseMediaQuery) => {
  const screenSize = useScreenSize();

  // get current screen size index
  const sizeIndex = screenSizes.indexOf(size);

  // slice array of sizes according to direction
  // if 'to' - get sizes from index 0 to sizeIndex
  // else - get sizes from sizeIndex to the end of array
  const sizesSlice = direction === 'to' ? screenSizes.slice(0, sizeIndex + 1) : screenSizes.slice(sizeIndex);

  return sizesSlice.includes(screenSize);
};
