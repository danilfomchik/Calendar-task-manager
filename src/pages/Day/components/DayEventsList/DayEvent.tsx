import {memo} from 'react';

import DeleteIcon from '@/components/ui/icons/DeleteIcon';
import EditIcon from '@/components/ui/icons/EditIcon';
import {deleteEvent, setEventFormData} from '@/redux/events/eventsSlice';
import {TEvent} from '@/redux/events/types';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {getCalendarColor} from '@/services/calendars';
import {EVENT_FORM_ID} from '@/services/constants';
import {cx} from '@/services/utils';
import {FormActionType} from '@/types/eventFormTypes';

const CONTROL_CLASS =
  'flex size-11 shrink-0 cursor-pointer items-center justify-center text-text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-40 md:size-9';

// One row of the Day events list: Home's Agenda row plus explicit edit and delete controls.
// A Dimmed event stays visible (dashed, hollow bar, italic) but its controls are disabled.
const DayEvent = ({event, isDimmed}: {event: TEvent; isDimmed: boolean}) => {
  const dispatch = useAppDispatch();

  const handleEdit = () => {
    dispatch(onOpenItem(EVENT_FORM_ID));
    dispatch(setEventFormData({actionType: FormActionType.edit, event}));
  };

  const handleDelete = () => {
    dispatch(deleteEvent(event));
  };

  return (
    <li
      title={isDimmed ? `${event.title} (filtered out)` : undefined}
      style={{'--calendar-color': getCalendarColor(event.eventCalendar)} as React.CSSProperties}
      className={cx(
        'flex min-h-11 items-stretch gap-3 border transition-colors',
        isDimmed
          ? 'border-dashed border-line-strong bg-transparent'
          : 'border-line bg-surface-raised hover:border-line-strong hover:bg-surface-overlay',
      )}>
      <span aria-hidden className={cx('w-1 shrink-0', isDimmed ? 'bg-transparent' : 'bg-(--calendar-color)')} />

      {/* the whole row opens the form on click, like Home's Agenda row; keyboard users get the Edit button */}
      <div
        onClick={isDimmed ? undefined : handleEdit}
        title={isDimmed ? undefined : 'Click to edit event'}
        className={cx(
          'flex min-w-0 flex-1 flex-col justify-center gap-0.5 py-2',
          isDimmed ? 'cursor-not-allowed' : 'cursor-pointer',
        )}>
        <span
          className={cx(
            'text-[15px] leading-tight font-semibold wrap-break-word',
            isDimmed ? 'text-text-faint italic' : 'text-text',
          )}>
          {event.title}
          {isDimmed && <span className="sr-only"> (filtered out)</span>}
        </span>
        {event.description && (
          <span className={cx('line-clamp-3 text-sm', isDimmed ? 'text-text-faint' : 'text-text-muted')}>
            {event.description}
          </span>
        )}
        <span className="truncate font-mono text-[11px] tracking-wider text-text-faint uppercase">
          {event.eventCalendar}
        </span>
      </div>

      <div className="flex shrink-0 items-center self-center pr-1">
        <button
          type="button"
          disabled={isDimmed}
          onClick={handleEdit}
          aria-label={`Edit ${event.title}`}
          title="Edit event"
          className={cx(CONTROL_CLASS, 'enabled:hover:text-action')}>
          <EditIcon className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          disabled={isDimmed}
          onClick={handleDelete}
          aria-label={`Delete ${event.title}`}
          title="Delete event"
          className={cx(CONTROL_CLASS, 'enabled:hover:text-text')}>
          <DeleteIcon className="size-4" aria-hidden />
        </button>
      </div>
    </li>
  );
};

export default memo(DayEvent);
