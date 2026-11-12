import {useParams} from 'react-router';

import DayContext from './components/DayContext';
import ContextButton from './components/DayContext/ContextButton';
import {DayContextProvider} from './components/DayContext/DayContextState';
import DayEventsList from './components/DayEventsList';
import DaySummary from './components/DaySummary';
import Masthead from './components/Masthead';
import AddEventDayButton from './components/Masthead/AddEventDayButton';
import QuickAdd from './components/QuickAdd';
import ShortcutsHint from './components/ShortcutsHint';
import {useDayShortcuts} from './hooks/useDayShortcuts';

const DayPage = () => {
  const {date} = useParams<{date: string}>();
  const viewedDate = date ?? '';
  useDayShortcuts(viewedDate);

  return (
    <DayContextProvider className="flex h-full flex-col">
      <Masthead date={viewedDate} />

      <div className="flex min-h-0 flex-1 max-md:flex-col max-md:overflow-auto">
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 max-md:pb-28 md:overflow-auto md:p-5">
          <DaySummary date={viewedDate} />
          <QuickAdd key={viewedDate} date={viewedDate} />
          <DayEventsList date={viewedDate} />
          <ShortcutsHint className="mt-auto pt-6" />
        </div>

        <DayContext date={viewedDate} />
      </div>

      {/* a solid docked bar, so events scrolling underneath never show through around the buttons */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-end gap-2 border-t border-line bg-surface-sunken px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
        <ContextButton date={viewedDate} />
        <AddEventDayButton date={viewedDate} floating />
      </div>
    </DayContextProvider>
  );
};

export default DayPage;
