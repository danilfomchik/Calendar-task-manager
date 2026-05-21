import CalendarDatePicker from './CalendarDatePicker';
import Controls from './Controls';

const Header = () => {
  return (
    <header className="h-header-height flex flex-1 items-center justify-between gap-[20px] py-4 md:py-5 px-3 md:px-5 md:border-b border-secondary-background-color">
      <CalendarDatePicker />
      <Controls />
    </header>
  );
};

export default Header;
