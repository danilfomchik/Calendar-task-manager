import {useSelector} from 'react-redux';

import {selectFullDate} from '@/redux/date/selectors';
import {selectHasAnyEvents} from '@/redux/events/selectors';
import {selectCalendarsMap} from '@/redux/myCalendars/selectors';
import {getYearMonthKey} from '@/services/dateUtils';
import {cx} from '@/services/utils';

import {TEmptyMonthNoteProps} from './types';

// A quiet line when the Visible month has no events (neighbouring months' days don't count), so an empty grid reads as
// "nothing here" rather than "not loaded". Uses the per-month event counts the sidebar shows; never blocks clicks.
// Plain text, no box: from md it is a caption under the month title it describes (a framed box over the grid read as a
// tooltip stuck on the cells); on mobile the grid has no cell borders, so it sits in the gap between two week rows.
// Not on first run (no events anywhere): the Agenda panel / Bottom sheet holds the one first-run state, and a note on
// an empty grid would only say it again.
const EmptyMonthNote = ({className}: TEmptyMonthNoteProps) => {
  const fullDate = useSelector(selectFullDate);
  const calendarsMap = useSelector(selectCalendarsMap);
  const hasAnyEvents = useSelector(selectHasAnyEvents);

  const monthCounts = calendarsMap[getYearMonthKey(fullDate)];
  const isEmpty = !monthCounts || Object.values(monthCounts).every(count => !count);

  if (!isEmpty || !hasAnyEvents) return null;

  return (
    <p className={cx('pointer-events-none text-caption text-text-faint', className)}>Nothing planned this month</p>
  );
};

export default EmptyMonthNote;
