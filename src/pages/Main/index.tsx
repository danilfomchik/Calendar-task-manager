import moment from 'moment';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {MONTH_GRID_ID} from '@/components/layout/MainLayout/constants';
import {useDocumentTitle} from '@/hooks/useDocumentTitle';
import {markMonthGridShown} from '@/redux/date/dateSlice';
import {selectFullDate} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';

import AgendaPanel from './components/AgendaPanel';
import Calendar from './components/Calendar';
import Header from './components/Header';
import MonthAnnouncer from './components/MonthAnnouncer';

const MainPage = () => {
  const dispatch = useAppDispatch();

  // the Visible month, as the header shows it
  useDocumentTitle(moment(useSelector(selectFullDate)).format('MMMM YYYY'));

  // lets the Day page's "Back to month" return to the month shown here
  useEffect(() => {
    dispatch(markMonthGridShown());
  }, [dispatch]);

  return (
    <div className="flex flex-col h-full">
      <Header />
      <MonthAnnouncer />

      <div className="flex min-h-0 shrink-0">
        {/* the skip link's target: focused (not tabbable), so the next Tab lands in the Month grid */}
        <div id={MONTH_GRID_ID} tabIndex={-1} className="flex min-w-0 flex-1 flex-col focus-visible:outline-none!">
          <Calendar />
        </div>

        <AgendaPanel />
      </div>
    </div>
  );
};

export default MainPage;
