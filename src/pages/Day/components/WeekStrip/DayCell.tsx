import moment from 'moment';
import {Link} from 'react-router';

import {getDayPath} from '@/services/dateUtils';
import {cx} from '@/services/utils';

import {getDayCellLabel} from '../../helpers';
import MixBar from './MixBar';
import {useEventMix} from './useEventMix';

type TDayCellProps = {
  date: string;
  // days from the Viewed day: -1 and 1 get the "Previous" / "Next" hover hint
  offset: number;
  isToday: boolean;
  isPast: boolean;
  // hairline on the left, except where a neighbour already draws one
  withDivider: boolean;
};

// Compact Week strip cell: weekday, numeral and the day's Event mix; clicking opens that day
const DayCell = ({date, offset, isToday, isPast, withDivider}: TDayCellProps) => {
  const colors = useEventMix(date, isPast);
  const day = moment(date);
  const isWeekend = day.isoWeekday() >= 6;
  const hint = offset === -1 ? 'Previous' : offset === 1 ? 'Next' : null;
  const label = `${getDayCellLabel(date, colors.length)}${isToday ? ', today' : ''}`;

  return (
    <li className={cx('flex min-w-0 flex-1', withDivider && 'border-l border-line')}>
      <Link
        to={getDayPath(date)}
        aria-label={label}
        title={label}
        className={cx(
          'group flex w-full min-w-0 flex-col justify-between gap-1 px-1.5 py-2.5 transition-colors hover:bg-surface-raised focus-visible:-outline-offset-2 active:bg-surface-raised max-md:items-center md:gap-2 md:px-3 md:py-3',
          isWeekend && 'bg-surface-sunken',
          isPast ? 'text-text-faint' : 'text-text-muted',
        )}>
        <span className="flex w-full items-baseline justify-center gap-1 font-mono text-[11px] uppercase tracking-wider md:justify-between md:text-xs">
          <span className="md:hidden">{day.format('dd')}</span>
          <span className="max-md:hidden">{day.format('ddd')}</span>
          {isToday ? (
            <span className="text-[11px] text-info max-md:hidden">Today</span>
          ) : (
            hint && (
              <span className="text-[11px] text-info opacity-0 transition-opacity group-hover:opacity-100 max-md:hidden">
                {hint}
              </span>
            )
          )}
        </span>
        {/* today: info colour plus an underline, so it is not marked by colour alone */}
        <span
          className={cx(
            'font-display text-xl leading-none font-extrabold group-hover:text-text md:text-3xl',
            isToday && 'text-info underline decoration-info decoration-2 underline-offset-4 group-hover:text-info',
          )}>
          {day.format('D')}
        </span>
        <MixBar colors={colors} />
      </Link>
    </li>
  );
};

export default DayCell;
