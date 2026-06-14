// import {useState} from 'react';
import {Link} from 'react-router';

import Button from '@/components/common/Button';
import MonthSmallCalendar from '@/components/common/MonthSmallCalendar';
import SidebarIcon from '@/components/ui/icons/SidebarIcon';

import MyCalendarsList from './components/MyCalendarsList';

const Aside = () => {
  // const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="flex-[0_0_240px] py-5 border-r border-secondary-background-color divide-y-[1px] divide-secondary-background-color bg-[#080808] max-lg:hidden">
      {/* <SidebarIcon /> */}
      <Button
        className="p-0 bg-transparent border-none transition-all"
        startIcon={<SidebarIcon className="size-5" />}
      />

      <div className="flex items-center justify-between gap-3 px-4 pb-5">
        <Link to="/" className="text-lg text-white font-medium">
          Calendar
        </Link>
        <div className="w-2.5 h-2.5 bg-[#4A6CF7] rounded-full"></div>
      </div>

      <MonthSmallCalendar />
      <MyCalendarsList />
    </aside>
  );
};

export default Aside;
