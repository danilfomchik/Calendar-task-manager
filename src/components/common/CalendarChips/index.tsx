import {formatEventsCount} from '@/services/dateUtils';
import {calendarColorStyle} from '@/services/styles';
import {cx} from '@/services/utils';

import {TCalendarChipsProps} from './types';

// One square chip per calendar: dot, name, event count. Used by the Day summary.
const CalendarChips = ({chips, className}: TCalendarChipsProps) => (
  <ul aria-label="Events per calendar" className={cx('flex flex-wrap gap-1.5', className)}>
    {chips.map(chip => (
      <li
        key={chip.name}
        title={`${chip.name}: ${formatEventsCount(chip.count)}`}
        style={calendarColorStyle(chip.color)}
        className="flex shrink-0 items-center gap-1.5 border border-line px-2 py-0.5 font-mono text-[11px] whitespace-nowrap text-text-muted">
        <span aria-hidden className="size-2 rounded-full bg-(--calendar-color)" />
        <span className="uppercase">{chip.name}</span>
        {chip.count}
      </li>
    ))}
  </ul>
);

export default CalendarChips;
