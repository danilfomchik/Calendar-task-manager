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
          'fixed left-0 top-0 bottom-0 flex-[0_0_240px] py-5 border-r border-line bg-surface-sunken transition-transform duration-200 ease-out translate-x-0 z-70 max-w-60',
          {
            '-translate-x-60': !isOpen,
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
