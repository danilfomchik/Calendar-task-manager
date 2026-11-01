import Calendar from './components/Calendar';
import Header from './components/Header';

// TODO: add tab support
// TODO: add arrow position
// TODO: add position recalculation on resize/scroll

const MainPage = () => {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <Calendar />
    </div>
  );
};

export default MainPage;
