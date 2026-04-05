import {Suspense, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Outlet} from 'react-router';

import Loading from '@/components/ui/Loading';
import {selectOpenedItems} from '@/redux/overflow/selectors';

import Aside from '../Aside';

const MainLayout = () => {
  const openedItems = useSelector(selectOpenedItems);

  useEffect(() => {
    if (openedItems > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openedItems]);

  return (
    <>
      <Aside />
      <main className="h-full flex-1 overflow-y-auto">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
};

export default MainLayout;
