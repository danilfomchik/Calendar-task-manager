import {setEventFormData} from '@/redux/events/eventsSlice';
import {TEvent} from '@/redux/events/types';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {getCalendarColor} from '@/services/calendars';
import {EVENT_FORM_ID} from '@/services/constants';
import {cx} from '@/services/utils';
import {FormActionType} from '@/types/eventFormTypes';

// one row of the Agenda panel; a Dimmed event stays visible but non-interactive (same rule as the grid)
const AgendaEvent = ({event, isDisabled}: {event: TEvent; isDisabled: boolean}) => {
  const dispatch = useAppDispatch();

  const handleOpen = () => {
    dispatch(onOpenItem(EVENT_FORM_ID));
    dispatch(setEventFormData({actionType: FormActionType.edit, event}));
  };

  return (
    <button
      type="button"
      disabled={isDisabled}
      title={isDisabled ? `${event.title} (filtered out)` : 'Click to edit event'}
      onClick={handleOpen}
      style={{'--calendar-color': getCalendarColor(event.eventCalendar)} as React.CSSProperties}
      className={cx(
        'flex w-full min-h-11 items-stretch gap-3 border text-left transition-colors',
        isDisabled
          ? 'cursor-not-allowed border-dashed border-line-strong bg-transparent'
          : 'cursor-pointer border-line bg-surface-raised hover:border-line-strong hover:bg-surface-overlay',
      )}>
      <span aria-hidden className={cx('w-1 shrink-0', isDisabled ? 'bg-transparent' : 'bg-(--calendar-color)')} />
      <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 py-2 pr-3">
        <span
          className={cx(
            'truncate text-[15px] font-semibold leading-tight',
            isDisabled ? 'text-text-faint italic' : 'text-text',
          )}>
          {event.title}
        </span>
        <span className="font-mono truncate text-[11px] uppercase tracking-wider text-text-faint">
          {event.eventCalendar}
          {event.description ? ` · ${event.description}` : ''}
        </span>
      </span>
    </button>
  );
};

export default AgendaEvent;
