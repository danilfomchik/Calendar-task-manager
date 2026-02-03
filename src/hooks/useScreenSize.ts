import {useCallback, useEffect, useState} from 'react';

import {TScreenSizes} from '@/services/types';

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<TScreenSizes>('');

  const handleResize = useCallback(() => {
    if (window.innerWidth < 640) {
      setScreenSize('xs');
    } else if (window.innerWidth >= 640 && window.innerWidth < 768) {
      setScreenSize('sm');
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      setScreenSize('md');
    } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
      setScreenSize('lg');
    } else if (window.innerWidth >= 1280 && window.innerWidth < 1536) {
      setScreenSize('xl');
    } else if (window.innerWidth >= 1536) {
      setScreenSize('2xl');
    }
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(handleResize);
    if (document.body) observer.observe(document.body);

    return () => observer.disconnect();
  }, [handleResize]);

  return screenSize;
};
