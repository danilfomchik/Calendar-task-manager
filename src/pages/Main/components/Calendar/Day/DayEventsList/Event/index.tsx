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
      title="Click to edit event"
      className={cx(
        'md:h-(--event-height) relative flex flex-1 items-center gap-3 max-md:flex-[0_0_6px] md:overflow-x-hidden md:p-1 md:pl-1.5 rounded-md cursor-pointer',
        'group/event overflow-hidden isolate',
        {
          'opacity-10 pointer-events-none cursor-not-allowed': isDisabled,
        },
      )}
      style={
        {
          '--calendar-color': calendarColor,
        } as React.CSSProperties
      }
      onClick={handleOpen}>
      {/* base gradient layer */}
      <span
        aria-hidden
        className="max-md:hidden absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(from_var(--calendar-color)_r_g_b/0.15),#0a0a0a)]"
      />
      {/* hover gradient layer, faded in on hover */}
      <span
        aria-hidden
        className="max-md:hidden absolute inset-0 -z-10 opacity-0 transition-opacity duration-350 group-hover/event:opacity-100 bg-[linear-gradient(to_right,rgb(from_var(--calendar-color)_r_g_b/0.5),#0a0a0a)]"
      />
      <div className="h-1.5 md:h-full w-1.5 md:w-0.75 rounded-full transition-opacity aspect-square bg-(--calendar-color)"></div>

      <p className="max-md:hidden flex-1 whitespace-nowrap text-xs text-left truncate z-1">{event.title}</p>
    </button>
  );
};

export default memo(Event);
