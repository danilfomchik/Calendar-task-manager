import {memo} from 'react';

import {useMediaQuery} from '@/hooks/useMediaQuery';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {getCalendarColor} from '@/services/calendars';
import {EVENT_FORM_ID} from '@/services/constants';
import {cx} from '@/services/utils';
import {FormActionType} from '@/types/eventFormTypes';

import {TEventProps} from './types';

const Event = ({event, isDisabled}: TEventProps) => {
  const isMobileScreen = useMediaQuery({size: 'md', direction: 'to'});

  const calendarColor = getCalendarColor(event.eventCalendar);

  const dispatch = useAppDispatch();

  const handleOpen = () => {
    if (isMobileScreen) return;

    dispatch(onOpenItem(EVENT_FORM_ID));
    dispatch(setEventFormData({actionType: FormActionType.edit, event}));
  };

  return (
    <button
      type="button"
      disabled={isDisabled}
      title={`${event.title} · ${event.eventCalendar}`}
      className={cx(
        'h-(--event-height) w-full shrink-0 flex items-center gap-1.5 overflow-hidden text-left text-xs leading-none',
        isDisabled
          ? 'cursor-not-allowed border border-dashed border-line-strong bg-transparent'
          : 'cursor-pointer bg-surface-overlay hover:bg-line',
      )}
      style={{'--calendar-color': calendarColor} as React.CSSProperties}
      onClick={e => {
        e.stopPropagation();
        handleOpen();
      }}>
      <span
        aria-hidden
        className={cx('h-full w-0.75 shrink-0', isDisabled ? 'bg-transparent' : 'bg-(--calendar-color)')}
      />
      <span className={cx('truncate', isDisabled ? 'text-text-faint italic' : 'text-text')}>{event.title}</span>
    </button>
  );
};

export default memo(Event);
