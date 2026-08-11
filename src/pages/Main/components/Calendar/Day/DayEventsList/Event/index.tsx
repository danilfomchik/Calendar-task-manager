import {memo} from 'react';

import Tooltip from '@/components/ui/Tooltip';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {getCalendarColor} from '@/services/calendars';
import {EVENT_FORM_ID} from '@/services/constants';
import {cx} from '@/services/utils';
import {FormActionType} from '@/types/eventFormTypes';

import {TEventProps} from './types';

const Event = ({event, isDisabled, eventRef}: TEventProps) => {
  const calendarColor = getCalendarColor(event.eventCalendar);

  const dispatch = useAppDispatch();

  const handleOpen = () => {
    dispatch(onOpenItem(EVENT_FORM_ID));
    dispatch(setEventFormData({actionType: FormActionType.edit, event}));
  };

  return (
    <Tooltip
      // className="h-1.5 md:h-[8px] w-1.5 md:w-[8px]"
      style={{color: calendarColor}}
      triggerElement={
        <button
          ref={eventRef}
          className={cx(
            'h-1.5 md:h-[8px] w-1.5 md:w-[8px] rounded-full transition-opacity max-md:pointer-events-none',
            {
              'opacity-10 pointer-events-none cursor-not-allowed': isDisabled,
            },
          )}
          style={{background: calendarColor}}
          onClick={handleOpen}></button>
      }>
      <div className="bg-[#0a0a0a] rounded-[4px]">
        <div
          className="text-white text-sm px-3 py-2 rounded-[4px]"
          style={{
            backgroundColor: `rgb(from ${calendarColor} r g b / 0.15)`,
            borderLeft: `2px solid ${calendarColor}`,
          }}>
          {event.title}
        </div>
      </div>
    </Tooltip>
  );
};

export default memo(Event);
