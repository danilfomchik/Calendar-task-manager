import moment from 'moment';
import {useSelector} from 'react-redux';

import ArrowRight from '@/components/ui/icons/ArrowRight';
import {focusDayCellAfter} from '@/pages/Main/dayCell';
import {setFullDate} from '@/redux/date/dateSlice';
import {selectFullDate} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {formatDate, generateDatesArray} from '@/services/dateUtils';
import {stopPropagation} from '@/services/dom';
import {ACTION_HAIRLINE_BASE_CLASS} from '@/services/styles';
import {cx} from '@/services/utils';

import {TNotInViewCueProps} from './types';

// "Not in view" and a Go to chip under the date block when the selected day is not among the Month grid's cells
// (after ‹ ›, ← / →, a Month swipe or the month picker moved the Visible month away from it). Go to shows the selected day's month and hands
// focus to its cell, since the cue itself disappears. Renders nothing while the day is in the grid, dimmed
// neighbouring-month days included. Inline (the Bottom sheet, whose short numeral leaves no room for a third line) it
// is just the Go to chip after the month, with "Not in view" kept for screen readers.
const NotInViewCue = ({date, isInline = false, className}: TNotInViewCueProps) => {
  const dispatch = useAppDispatch();
  const visibleMonth = moment(useSelector(selectFullDate));
  const gridDates = generateDatesArray(formatDate(visibleMonth, 'YYYY'), formatDate(visibleMonth, 'MMMM'));

  if (gridDates.includes(date)) return null;

  const handleGoTo = () => {
    focusDayCellAfter(date, () => dispatch(setFullDate(date)));
  };

  return (
    <span className={cx('flex shrink-0 items-center gap-2 text-caption text-text-faint', className)}>
      <span className={isInline ? 'sr-only' : 'truncate'}>Not in view</span>
      <button
        type="button"
        // the Bottom sheet's date row is a drag area; tapping Go to never moves the sheet. A hairline chip in the action
        // green, 20px tall so the month line never grows (leading-none so the caption's 16px line box doesn't pad the
        // fixed height); the pseudo-element widens it to a 44px touch target
        onPointerDown={stopPropagation}
        onClick={handleGoTo}
        aria-label={`Go to ${moment(date).format('MMMM YYYY')}`}
        className={cx(
          ACTION_HAIRLINE_BASE_CLASS,
          "relative z-20 inline-flex h-5 shrink-0 gap-0.5 pr-1 pl-1.5 text-caption leading-none before:absolute before:-inset-x-2 before:-inset-y-3 before:content-['']",
        )}>
        Go to
        <ArrowRight size="size-3" aria-hidden />
      </button>
    </span>
  );
};

export default NotInViewCue;
