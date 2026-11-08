// PROTOTYPE (throwaway): home page redesign. A = agenda panel (desktop) / bottom sheet (mobile), E = Matrix (calendars x days).
// Events have no time field, so no start times are shown.
import {useEffect} from 'react';

import {useMediaQuery} from '@/hooks/useMediaQuery';

import DesktopHome from './DesktopHome';
import MatrixHome from './MatrixHome';
import MobileSheetHome from './MobileSheetHome';
import './proto.css';
import {TProtoVariant} from './useProtoVariant';

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;700;800&family=JetBrains+Mono:wght@400;500&display=swap';

const ProtoHome = ({variant}: {variant: Exclude<TProtoVariant, '0'>}) => {
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
      {variant === 'E' ? <MatrixHome compact={isMobile} /> : isMobile ? <MobileSheetHome /> : <DesktopHome />}
    </div>
  );
};

export default ProtoHome;
