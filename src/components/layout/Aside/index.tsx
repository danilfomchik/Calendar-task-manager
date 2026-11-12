import {useSelector} from 'react-redux';
import {Link} from 'react-router';

import MonthSmallCalendar from '@/components/common/MonthSmallCalendar';
import SidebarToggle from '@/components/common/SidebarToggle';
import {selectIsSidebarOpen} from '@/redux/sidebar/selectors';
import {onToggleSidebar} from '@/redux/sidebar/sidebarSlice';
import {useAppDispatch} from '@/redux/store';
import {cx} from '@/services/utils';

import MyCalendarsList from './components/MyCalendarsList';

const Aside = () => {
  const dispatch = useAppDispatch();
  const isOpen = useSelector(selectIsSidebarOpen);

  const handleToggle = () => {
    dispatch(onToggleSidebar());
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-overlay bg-opacity-80 z-60 md:hidden" onClick={handleToggle}></div>}

      <aside
        className={cx(
          // Below md the sidebar is an overlay, wide enough for 44px mini-calendar days (7 x 44 + gaps + padding);
          // from md it is the 240px column the page is offset by (md:ml-60)
          'fixed left-0 top-0 bottom-0 w-86 max-w-[calc(100vw-1rem)] md:w-60 md:max-w-60 py-5 border-r border-line bg-surface-sunken transition-transform duration-200 ease-out translate-x-0 z-70',
          {
            '-translate-x-full': !isOpen,
          },
        )}>
        <div className="flex items-center justify-between gap-3 px-4 pb-5">
          <Link
            to="/"
            className="max-md:flex max-md:min-h-11 max-md:items-center font-display font-extrabold tracking-tight text-xl text-text">
            Calendar
          </Link>
          <SidebarToggle />
        </div>

        <MonthSmallCalendar className="border-y border-line" />
        <MyCalendarsList />
      </aside>
    </>
  );
};

export default Aside;
