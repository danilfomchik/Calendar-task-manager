import {useEffect} from 'react';

import {markMonthGridShown} from '@/redux/date/dateSlice';
import {useAppDispatch} from '@/redux/store';

import AgendaPanel from './components/AgendaPanel';
import Calendar from './components/Calendar';
import Header from './components/Header';

const MainPage = () => {
  const dispatch = useAppDispatch();

  // lets the Day page's "Back to month" return to the month shown here
  useEffect(() => {
    dispatch(markMonthGridShown());
  }, [dispatch]);

  return (
    <div className="flex flex-col h-full">
      <Header />

      <div className="flex min-h-0 shrink-0">
        <div className="flex min-w-0 flex-1 flex-col">
          <Calendar />
        </div>

        <AgendaPanel />
      </div>
    </div>
  );
};

export default MainPage;
