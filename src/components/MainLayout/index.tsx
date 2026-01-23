import {Suspense, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Outlet} from 'react-router';

import Loading from '@/components/Loading';
import {selectOpenedItems} from '@/redux/overflow/selectors';

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
    <main className="h-full">
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </main>
  );
};

export default MainLayout;
