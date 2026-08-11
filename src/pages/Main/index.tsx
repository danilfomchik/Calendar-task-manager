import Calendar from './components/Calendar';
import Header from './components/Header';

const MainPage = () => {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <Calendar />
    </div>
  );
};

export default MainPage;
