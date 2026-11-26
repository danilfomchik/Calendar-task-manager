import moment from 'moment';

import PlusIcon from '@/components/ui/icons/PlusIcon';
import {useOpenCreateEvent} from '@/pages/Main/hooks/useOpenCreateEvent';
import {getTodayKey} from '@/services/dateUtils';
import {ACTION_HAIRLINE_BASE_CLASS} from '@/services/styles';
import {cx} from '@/services/utils';

import {TFirstRunProps} from './types';

// The one first-run empty state (no events anywhere): the header above already says "Free day" and the Month grid
// shows no note, so this only says how adding works and offers it. In the panel the add button names the selected
// day; in the sheet the green + docked beside the date adds, so the line points up to it instead.
const FirstRun = ({date, placement}: TFirstRunProps) => {
  const openCreateEvent = useOpenCreateEvent();
  const day = moment(date);
  const dayName = date === getTodayKey() ? 'today' : day.format('D MMMM');

  if (placement === 'sheet') {
    return (
      <p className="text-para-s text-pretty text-text-muted">
        An event lands on the day you select. Pick one in the grid, or tap the + beside the date to add to {dayName}.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-para-s text-pretty text-text-muted">
        An event lands on the day you select. Pick one in the grid, or start with {dayName}.
      </p>
      {/* the green hairline action, not a second solid green: the header's Add event stays the page's one filled
          control and adds to the same day */}
      <button
        type="button"
        onClick={openCreateEvent}
        className={cx(ACTION_HAIRLINE_BASE_CLASS, 'flex h-11 w-full gap-2 px-3 text-para-s md:h-9')}>
        <PlusIcon size="size-4" aria-hidden />
        Add to {day.format('D MMMM')}
      </button>
    </div>
  );
};

export default FirstRun;
