import {useSelector} from 'react-redux';

import ArrowLeft from '@/components/ui/icons/ArrowLeft';
import ArrowRight from '@/components/ui/icons/ArrowRight';
import {useGoToToday} from '@/pages/Main/hooks/useGoToToday';
import {shiftMonth} from '@/redux/date/dateSlice';
import {selectFullDate, selectSelectedDate} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {getTodayKey, getYearMonthKey} from '@/services/dateUtils';
import {cx} from '@/services/utils';

// one segment of the hairline group: the group draws the outer border (so a segment is 2px short of the 44 / 36px
// control height), the arrows the inner dividers. The focus ring is drawn inside so it isn't hidden under a
// neighbouring segment
const SEGMENT_CLASS =
  'h-10.5 min-w-10.5 cursor-pointer items-center justify-center text-text-muted transition-colors hover:bg-surface-raised hover:text-text focus-visible:-outline-offset-2 md:h-8.5 md:min-w-8.5';

// ‹ Today › as one segmented hairline control. Below md only Today shows (Month swipe covers the arrows)
const ChangeMonthControl = () => {
  const dispatch = useAppDispatch();
  const fullDate = useSelector(selectFullDate);
  const selectedDate = useSelector(selectSelectedDate);
  const goToToday = useGoToToday();

  const today = getTodayKey();
  // nothing to return to when today's month is shown and today is selected. aria-disabled rather than disabled, so
  // the button keeps keyboard focus after the click that brought the page to today
  const isAtToday = selectedDate === today && getYearMonthKey(fullDate) === getYearMonthKey(today);

  return (
    <div role="group" aria-label="Month navigation" className="flex items-stretch border border-line-strong">
      <button
        type="button"
        aria-label="Previous month"
        title="Previous month"
        className={cx(SEGMENT_CLASS, 'hidden border-r border-line-strong md:flex')}
        onClick={() => dispatch(shiftMonth(-1))}>
        <ArrowLeft size="size-4" aria-hidden />
      </button>
      <button
        type="button"
        aria-disabled={isAtToday || undefined}
        className={cx(
          SEGMENT_CLASS,
          'flex px-2 text-para-s md:px-3 aria-disabled:cursor-default aria-disabled:text-text-faint aria-disabled:hover:bg-transparent aria-disabled:hover:text-text-faint',
        )}
        onClick={isAtToday ? undefined : goToToday}>
        Today
      </button>
      <button
        type="button"
        aria-label="Next month"
        title="Next month"
        className={cx(SEGMENT_CLASS, 'hidden border-l border-line-strong md:flex')}
        onClick={() => dispatch(shiftMonth(1))}>
        <ArrowRight size="size-4" aria-hidden />
      </button>
    </div>
  );
};

export default ChangeMonthControl;
