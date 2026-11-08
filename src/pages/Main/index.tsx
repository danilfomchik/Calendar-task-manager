import {useMediaQuery} from '@/hooks/useMediaQuery';

import Calendar from './components/Calendar';
import Header from './components/Header';
import ProtoHome from './prototype/ProtoHome';
import PrototypeSwitcher from './prototype/PrototypeSwitcher';
import {TProtoVariant, useProtoVariant} from './prototype/useProtoVariant';

// TODO: add tab support
// TODO: add arrow position
// TODO: add position recalculation on resize/scroll

const DESKTOP_LABELS: Record<TProtoVariant, string> = {
  '0': 'Current',
  A: 'Agenda panel',
};
const MOBILE_LABELS: Record<TProtoVariant, string> = {
  '0': 'Current',
  A: 'Bottom sheet',
};

const MainPage = () => {
  // PROTOTYPE: ?variant=0|A (dev only; production always renders the current page)
  const {variant, setVariant} = useProtoVariant();
  const isMobile = useMediaQuery({size: 'sm', direction: 'to'});

  if (import.meta.env.PROD || variant === '0') {
    return (
      <>
        <div className="flex flex-col h-full">
          <Header />

          <Calendar />
        </div>
        <PrototypeSwitcher current={variant} labels={isMobile ? MOBILE_LABELS : DESKTOP_LABELS} onChange={setVariant} />
      </>
    );
  }

  return (
    <>
      <ProtoHome />
      <PrototypeSwitcher current={variant} labels={isMobile ? MOBILE_LABELS : DESKTOP_LABELS} onChange={setVariant} />
    </>
  );
};

export default MainPage;
