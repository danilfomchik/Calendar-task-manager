import {useMediaQuery} from '@/hooks/useMediaQuery';
import {getWeekDays, getWeekDaysMin} from '@/services/dateUtils';
import {cx} from '@/services/utils';

const WeekDays = () => {
  const weekDays = getWeekDays();
  // two letters on mobile (Mo Tu We), from the locale: single initials repeat (T T, S S)
  const weekDaysMin = getWeekDaysMin();
  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

  return (
    <div
      className={cx(
        'grid grid-cols-7 w-full shrink-0 text-caption text-text-faint',
        isMobileScreen ? 'py-1.5 text-center' : 'border-b border-l border-line border-l-transparent',
      )}>
      {weekDays.map((weekday, index) => (
        <span
          key={weekday}
          // desktop: same box model as a day cell (border-r + p-1.5) so labels sit over the numerals
          className={cx({'border-r border-line py-2 pr-1.5 pl-2.5': !isMobileScreen})}>
          {isMobileScreen ? weekDaysMin[index] : weekday.slice(0, 3)}
        </span>
      ))}
    </div>
  );
};

export default WeekDays;
