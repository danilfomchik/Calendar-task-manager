import moment from 'moment';
import {useParams} from 'react-router';

import CalendarMix from '@/components/common/CalendarMix';
import EventsTotal from '@/components/common/EventsTotal';
import {useEventsList} from '@/hooks/useEventsList';
import {formatDate} from '@/services/dateUtils';

import DayContext from './components/DayContext';
import ContextButton from './components/DayContext/ContextButton';
import {DayContextProvider} from './components/DayContext/DayContextState';
import DayEventsList from './components/DayEventsList';
import Masthead from './components/Masthead';
import AddEventDayButton from './components/Masthead/AddEventDayButton';
import QuickAdd from './components/QuickAdd';
import ShortcutsHint from './components/ShortcutsHint';
import {useDayShortcuts} from './hooks/useDayShortcuts';

const DayPage = () => {
  const {date} = useParams<{date: string}>();
  const viewedDate = date ?? '';
  useDayShortcuts(viewedDate);
  const events = useEventsList(viewedDate);
  const total = events?.length ?? 0;

  return (
    <DayContextProvider className="flex h-full flex-col">
      <Masthead date={viewedDate} />

      <div className="flex min-h-0 flex-1 max-md:flex-col max-md:overflow-auto">
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 max-md:pb-28 md:overflow-auto md:p-5">
          <h1 className="sr-only">{formatDate(moment(viewedDate), 'dddd, D MMMM')}</h1>
          <QuickAdd key={viewedDate} date={viewedDate} />
          {/* on desktop the Week strip's Viewed day carries the Calendar mix */}
          <div className="flex flex-col gap-2">
            <EventsTotal count={total} />
            <CalendarMix date={viewedDate} className="hidden max-md:flex" />
          </div>
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
