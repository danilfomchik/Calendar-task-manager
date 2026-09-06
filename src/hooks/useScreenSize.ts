import {useCallback, useLayoutEffect, useRef, useState} from 'react';

import {TScreenSizes} from '@/types/types';

const getScreenSize = () => {
  let size: TScreenSizes = '';

  if (window.innerWidth < 640) {
    size = 'xs';
  } else if (window.innerWidth >= 640 && window.innerWidth < 768) {
    size = 'sm';
  } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
    size = 'md';
  } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    size = 'lg';
  } else if (window.innerWidth >= 1280 && window.innerWidth < 1536) {
    size = 'xl';
  } else if (window.innerWidth >= 1536) {
    size = '2xl';
  }

  return size;
};

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<TScreenSizes>(getScreenSize());

  const requestRef = useRef<number | null>(null);

  const onResize = useCallback(() => {
    const size = getScreenSize();
    setScreenSize(size);
  }, []);

  useLayoutEffect(() => {
    onResize();

    const handleResize = () => {
      if (requestRef.current) return;

      requestRef.current = requestAnimationFrame(() => {
        onResize();
        requestRef.current = null;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [onResize]);

  return screenSize;
};
