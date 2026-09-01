import {memo, useCallback} from 'react';

import Button from '@/components/common/Button';
import BarsIcon from '@/components/ui/icons/BarsIcon';
import DeleteIcon from '@/components/ui/icons/DeleteIcon';
import EditIcon from '@/components/ui/icons/EditIcon';
import {deleteEvent, setEventFormData} from '@/redux/events/eventsSlice';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {getCalendarColor} from '@/services/calendars';
import {EVENT_FORM_ID} from '@/services/constants';
import {cx} from '@/services/utils';
import {FormActionType} from '@/types/eventFormTypes';

import {IEventsListItemProps} from './types';

const EventsListItem = ({event, showItemControls, isDisabled}: IEventsListItemProps) => {
  const dispatch = useAppDispatch();

  const calendarColor = getCalendarColor(event.eventCalendar);

  const handleDeleteEvent = useCallback(() => {
    dispatch(deleteEvent(event));
  }, [dispatch, event]);

  const handleOpen = () => {
    dispatch(onOpenItem(EVENT_FORM_ID));
    dispatch(setEventFormData({actionType: FormActionType.edit, event}));
  };

  return (
    <>
      <div
        className={cx(
          'relative flex items-center gap-6 max-md:gap-4 rounded-lg px-3 md:px-4 py-2 md:py-3 transition-opacity overflow-auto',
          'overflow-hidden isolate bg-[linear-gradient(to_right,rgb(from_var(--calendar-color)_r_g_b/0.15),#0a0a0a)] border-l-2 border-solid border-(--calendar-color)',
          {
            'opacity-10 pointer-events-none cursor-not-allowed select-none': isDisabled,
          },
        )}
        style={
          {
            '--calendar-color': calendarColor,
          } as React.CSSProperties
        }>
        <div className="flex-1">
          <h4 className="text-base md:text-lg font-semibold break-all">{event.title}</h4>

          {event.description && <p className="text-xs md:text-base text-gray-400 line-clamp-3">{event.description}</p>}

          {event.eventCalendar && (
            <div
              className="w-fit text-[10px]/[1] md:text-xs/[1] rounded-[20px] px-1.5 py-1 mt-1.5 font-medium"
              style={{background: `rgb(from ${calendarColor} r g b / 0.3)`, color: calendarColor}}>
              {event.eventCalendar}
            </div>
          )}
        </div>

        {showItemControls && (
          <div className="flex gap-4">
            <Button
              onClick={handleOpen}
              endIcon={<EditIcon size="size-4" />}
              className="w-fit p-0 text-white hover:text-sky-500"
              variant="transparent"
            />
            <Button
              variant="transparent"
              onClick={handleDeleteEvent}
              endIcon={<DeleteIcon size="size-4" />}
              className="w-fit p-0 text-white hover:text-red-400"
            />
          </div>
        )}

        <BarsIcon className="size-4 text-gray-400 cursor-pointer" />
      </div>
    </>
  );
};

export default memo(EventsListItem);
