import CalendarProvider from '@/providers/calendar-provider';

import Calendar from './components/Calendar';
import Header from './components/Header';

const MainPage = () => {
  return (
    <div className="flex flex-col h-full">
      <Header />

      <CalendarProvider>
        <Calendar />
      </CalendarProvider>
    </div>
  );
};

export default MainPage;
