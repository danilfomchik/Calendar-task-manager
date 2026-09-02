import {useScreenSize} from '@/hooks/useScreenSize';
import {getWeekDays} from '@/services/dateUtils';

const WeekDays = () => {
  const weekDays = getWeekDays();
  const screenSize = useScreenSize();

  return (
    <div className="grid grid-cols-7 w-full">
      {weekDays.map(weekday => (
        <span
          key={weekday}
          className="flex flex-1 justify-center px-2 uppercase text-[#444444] tracking-[0.08em] text-xs md:text-sm">
          {screenSize === 'sm' ? weekday.slice(0, 3) : screenSize === 'xs' ? weekday.slice(0, 1) : weekday}
        </span>
      ))}
    </div>
  );
};

export default WeekDays;
