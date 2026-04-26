import {memo, useCallback} from 'react';

import Button from '@/components/common/Button';
import EventForm from '@/components/common/EventForm';
import {FormActionType} from '@/components/common/EventForm/types';
import Modal from '@/components/common/Modal';
import BarsIcon from '@/components/ui/icons/BarsIcon';
import DeleteIcon from '@/components/ui/icons/DeleteIcon';
import EditIcon from '@/components/ui/icons/EditIcon';
import {useOpeningItem} from '@/hooks/useOpeningItem';
import {deleteEvent} from '@/redux/events/eventsSlice';
import {useAppDispatch} from '@/redux/store';
import {getCalendarColor} from '@/services/calendars';
import {cx} from '@/services/utils';

import {IEventsListItemProps} from './types';

const EventsListItem = ({event, showItemControls, isDisabled}: IEventsListItemProps) => {
  const dispatch = useAppDispatch();
  const {ref, isOpen, handleClose, handleOpen} = useOpeningItem();

  const calendarColor = getCalendarColor(event.eventCalendar);

  const handleDeleteEvent = useCallback(() => {
    dispatch(deleteEvent(event));
  }, [dispatch, event]);

  return (
    <>
      <div
        className={cx(
          'relative flex items-center gap-6 max-md:gap-4 rounded-lg px-4 py-3 transition-opacity overflow-auto',
          {
            'opacity-10 pointer-events-none cursor-not-allowed select-none': isDisabled,
          },
        )}
        style={{background: `rgb(from ${calendarColor} r g b / 0.3)`, borderLeft: `2px solid ${calendarColor}`}}>
        <div className="flex-1">
          <h4 className="text-lg font-semibold break-all">{event.title}</h4>

          {event.description && <p className="text-base text-gray-400 line-clamp-3">{event.description}</p>}

          {event.eventCalendar && (
            <div
              className="w-fit text-xs/[1] rounded-[20px] px-1.5 py-1 mt-1.5 font-medium"
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

      {isOpen && (
        <Modal refItem={ref} onClose={handleClose}>
          <EventForm
            actionType={FormActionType.edit}
            formTitle="Edit event form"
            event={event}
            handleModalClose={handleClose}
          />
        </Modal>
      )}
    </>
  );
};

export default memo(EventsListItem);
