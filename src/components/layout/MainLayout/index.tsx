import {Suspense, lazy, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Outlet} from 'react-router';

import Loading from '@/components/ui/Loading';
import {useOpeningItem} from '@/hooks/useOpeningItem';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {selectEventFormData} from '@/redux/events/selectors';
import {selectOpenedItems} from '@/redux/overflow/selectors';
import {selectIsSidebarOpen} from '@/redux/sidebar/selectors';
import {useAppDispatch} from '@/redux/store';
import {EVENT_FORM_ID} from '@/services/constants';
import {cx} from '@/services/utils';

import Aside from '../Aside';
import DataInitWrapper from '../DataInitWrapper';

const Modal = lazy(() => import('@/components/common/Modal'));
const EventForm = lazy(() => import('@/components/common/EventForm'));

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const openedItems = useSelector(selectOpenedItems);
  const eventFormData = useSelector(selectEventFormData);
  const isSidebarOpen = useSelector(selectIsSidebarOpen);

  const {ref, isOpen, handleClose: handleModalClose} = useOpeningItem(EVENT_FORM_ID);

  const handleClose = () => {
    handleModalClose();
    dispatch(setEventFormData(null));
  };

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
      <DataInitWrapper />

      <Aside />
      <main
        className={cx('ml-0 h-full flex-1 overflow-y-auto transition-all duration-300 ease-in-out', {
          'md:ml-60': isSidebarOpen,
        })}>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>

      {isOpen && (
        <Suspense
          fallback={
            <Loading className="bg-opacity-80 fixed top-1/2 left-1/2 z-1000 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-overlay [&>div]:size-8" />
          }>
          <Modal refItem={ref} onClose={handleClose}>
            <EventForm {...eventFormData} handleModalClose={handleClose} />
          </Modal>
        </Suspense>
      )}
    </>
  );
};

export default MainLayout;
