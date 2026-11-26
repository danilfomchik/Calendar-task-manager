import {memo} from 'react';

import {getEventColor} from '@/services/calendars';
import {calendarColorStyle} from '@/services/styles';
import {cx} from '@/services/utils';

import {TEventBarProps} from './types';

// One event in a narrow desktop cell: a chip miniature (the chip's neutral fill with its 3px calendar-coloured leading
// edge, without the title), so the cell still reads as that day's list (how many, from which calendars) when a chip's
// title would be cut to a few letters, and colour stays on the edge instead of filling the cell. Decorative: the cell
// selects the day and the Agenda panel lists the events by name. A Dimmed event is a hollow bar (shape, not only
// colour), as a filtered-out calendar's dot is.
const EventBar = ({event, isDisabled}: TEventBarProps) => (
  <span
    aria-hidden
    style={calendarColorStyle(getEventColor(event))}
    className={cx(
      // grows to share the list's free height, from the 7px minimum the slot count is measured with up to a chip's 18px
      'block flex-1 min-h-(--event-height) max-h-4.5 w-full',
      isDisabled ? 'border border-line-strong bg-transparent' : 'bg-chip shadow-[inset_3px_0_0_var(--calendar-color)]',
    )}
  />
);

export default memo(EventBar);
