import {AgendaPanelProvider} from './AgendaPanelContext';
import AgendaPanel from './components/AgendaPanel';
import Calendar from './components/Calendar';
import Header from './components/Header';

const MainPage = () => {
  return (
    <AgendaPanelProvider>
      <div className="flex flex-col h-full">
        <Header />

        <div className="flex min-h-0 shrink-0">
          <div className="flex min-w-0 flex-1 flex-col">
            <Calendar />
          </div>

          <AgendaPanel />
        </div>
      </div>
    </AgendaPanelProvider>
  );
};

export default MainPage;
