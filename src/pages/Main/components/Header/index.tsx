import {useSelector} from 'react-redux';

import SidebarToggle from '@/components/common/SidebarToggle';
import {selectIsSidebarOpen} from '@/redux/sidebar/selectors';
import {cx} from '@/services/utils';

import CalendarDatePicker from './CalendarDatePicker';
import Controls from './Controls';

const Header = () => {
  const isSidebarOpen = useSelector(selectIsSidebarOpen);

  return (
    <header
      className={cx(
        'h-16 md:h-22 shrink-0 flex items-center justify-between gap-3 md:gap-0 px-3 md:px-6 border-b border-line',
        {
          'md:gap-5': !isSidebarOpen,
        },
      )}>
      <SidebarToggle className={cx({'md:hidden': isSidebarOpen})} />

      <div className="flex flex-1 items-center justify-between gap-5">
        <CalendarDatePicker />
        <Controls />
      </div>
    </header>
  );
};

export default Header;
