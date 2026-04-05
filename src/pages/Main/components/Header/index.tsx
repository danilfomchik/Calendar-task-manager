import CalendarDatePicker from './CalendarDatePicker';
import Controls from './Controls';

const Header = () => {
  return (
    <header className="flex flex-1 items-center justify-between gap-[20px] py-[15px] px-[15px] md:px-[30px]">
      <CalendarDatePicker />
      <Controls />
    </header>
  );
};

export default Header;
