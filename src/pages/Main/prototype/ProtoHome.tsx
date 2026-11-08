// PROTOTYPE (throwaway): home page redesign. A = agenda panel (desktop) / bottom sheet (mobile). The Matrix variant lives on branch prototype/home-matrix.
// Events have no time field, so no start times are shown.
import {useEffect} from 'react';

import {useMediaQuery} from '@/hooks/useMediaQuery';

import DesktopHome from './DesktopHome';
import MobileSheetHome from './MobileSheetHome';
import './proto.css';

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;700;800&family=JetBrains+Mono:wght@400;500&display=swap';

const ProtoHome = () => {
  const isMobile = useMediaQuery({size: 'sm', direction: 'to'});

  useEffect(() => {
    document.documentElement.setAttribute('data-proto', '1');

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    document.head.appendChild(link);

    return () => {
      document.documentElement.removeAttribute('data-proto');
      link.remove();
    };
  }, []);

  return (
    <div className="proto-root h-full bg-(--surface-base) text-(--text)">
      {isMobile ? <MobileSheetHome /> : <DesktopHome />}
    </div>
  );
};

export default ProtoHome;
