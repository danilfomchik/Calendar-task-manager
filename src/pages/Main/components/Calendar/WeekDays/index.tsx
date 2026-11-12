import {useMediaQuery} from '@/hooks/useMediaQuery';
import {getWeekDays} from '@/services/dateUtils';
import {cx} from '@/services/utils';

const WeekDays = () => {
  const weekDays = getWeekDays();
  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

  return (
    <div
      className={cx(
        'grid grid-cols-7 w-full shrink-0 font-mono text-[11px] uppercase tracking-widest text-text-faint',
        isMobileScreen ? 'py-1.5 text-center' : 'border-b border-l border-line border-l-transparent',
      )}>
      {weekDays.map(weekday => (
        <span
          key={weekday}
          // desktop: same box model as a day cell (border-r + p-1.5) so labels sit over the numerals
          className={cx({'border-r border-line py-2 pr-1.5 pl-2.5': !isMobileScreen})}>
          {isMobileScreen ? weekday.slice(0, 1) : weekday.slice(0, 3)}
        </span>
      ))}
    </div>
  );
};

export default WeekDays;
