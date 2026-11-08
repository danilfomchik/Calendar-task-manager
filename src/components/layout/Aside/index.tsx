import {useSelector} from 'react-redux';
import {Link} from 'react-router';

import MonthSmallCalendar from '@/components/common/MonthSmallCalendar';
import OpenSidebarBtn from '@/components/common/OpenSidebarBtn';
import SidebarToggle from '@/pages/Main/prototype/SidebarToggle';
import {useRedesign} from '@/pages/Main/prototype/useProtoVariant';
import {selectIsSidebarOpen} from '@/redux/sidebar/selectors';
import {onToggleSidebar} from '@/redux/sidebar/sidebarSlice';
import {useAppDispatch} from '@/redux/store';
import {cx} from '@/services/utils';

import MyCalendarsList from './components/MyCalendarsList';

const Aside = () => {
  const dispatch = useAppDispatch();
  const isOpen = useSelector(selectIsSidebarOpen);
  const isRedesign = useRedesign(); // PROTOTYPE

  const handleToggle = () => {
    dispatch(onToggleSidebar());
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-overlay bg-opacity-80 z-60 md:hidden" onClick={handleToggle}></div>}

      <aside
        className={cx(
          'fixed left-0 top-0 bottom-0 flex-[0_0_240px] py-5 border-r',
          isRedesign ? 'w-60 border-(--line) bg-(--surface-sunken)' : 'border-secondary-background-color bg-[#080808]',
          ' transition-all duration-300 ease-in-out translate-x-0 z-70 max-w-60',
          {
            '-translate-x-60': !isOpen,
          },
        )}>
        <div className="flex items-center justify-between gap-3 px-4 pb-5">
          <Link
            to="/"
            className={
              isRedesign ? 'proto-display text-xl leading-none text-(--text)' : 'text-lg text-white font-medium'
            }>
            Calendar
          </Link>
          {isRedesign ? <SidebarToggle /> : <OpenSidebarBtn />}
        </div>

        <MonthSmallCalendar
          className={cx('border-y', isRedesign ? 'border-(--line)' : 'border-secondary-background-color')}
        />
        <MyCalendarsList />
      </aside>
    </>
  );
};

export default Aside;
