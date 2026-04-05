import MonthSmallCalendar from '@/components/common/MonthSmallCalendar';

import MyCalendarsList from './components/MyCalendarsList';

const Aside = () => {
  return (
    <aside className="flex-[0_0_240px] py-5 border-r border-secondaryBackgroundColor divide-y-[1px] divide-secondaryBackgroundColor bg-[#080808]">
      <div className="flex items-center justify-between gap-3 px-4 pb-5">
        <p className="text-lg text-white font-medium">Calendar</p>
        <div className="w-2.5 h-2.5 bg-sky-500 rounded-full"></div>
      </div>

      <MonthSmallCalendar />
      <MyCalendarsList />
    </aside>
  );
};

export default Aside;
