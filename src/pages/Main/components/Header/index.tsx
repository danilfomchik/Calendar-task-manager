import {useSelector} from 'react-redux';

import OpenSidebarBtn from '@/components/common/OpenSidebarBtn';
import {selectIsSidebarOpen} from '@/redux/sidebar/selectors';
import {cx} from '@/services/utils';

import CalendarDatePicker from './CalendarDatePicker';
import Controls from './Controls';

const Header = () => {
  const isSidebarOpen = useSelector(selectIsSidebarOpen);

  return (
    <header
      className={cx(
        'h-header flex flex-1 items-center justify-between gap-5 md:gap-0 py-4 md:py-5 px-3 md:px-5 md:border-b border-secondary-background-color transition-all duration-300 ease-in-out',
        {
          'md:gap-5': !isSidebarOpen,
        },
      )}>
      <OpenSidebarBtn className="md:-translate-x-75 md:w-0" openClassName="md:translate-x-0 md:w-[20px]" />

      <div className="flex flex-1 items-center justify-between gap-5">
        <CalendarDatePicker />
        <Controls />
      </div>
    </header>
  );
};

export default Header;
