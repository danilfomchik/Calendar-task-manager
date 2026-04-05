import {useCallback} from 'react';

import Button from '@/components/common/Button';
import EventForm from '@/components/common/EventForm';
import {FormActionType} from '@/components/common/EventForm/types';
import Modal from '@/components/common/Modal';
import BarsIcon from '@/components/ui/icons/BarsIcon';
import DeleteIcon from '@/components/ui/icons/DeleteIcon';
import EditIcon from '@/components/ui/icons/EditIcon';
import {useOpeningItem} from '@/hooks/useOpeningItem';
import {deleteEvent} from '@/redux/events/eventsSlice';
import {TEvent} from '@/redux/events/types';
import {useAppDispatch} from '@/redux/store';

const EventsListItem = ({event, showItemControls}: {event: TEvent; showItemControls: boolean}) => {
  const dispatch = useAppDispatch();
  const {ref, isOpen, handleClose, handleOpen} = useOpeningItem();

  const handleDeleteEvent = useCallback(() => {
    dispatch(deleteEvent(event.id));
  }, [dispatch, event.id]);

  return (
    <>
      <div
        className="relative flex items-center gap-6 max-md:gap-4 rounded-lg px-4 py-3"
        style={{background: `rgb(from ${event.color} r g b / 0.15)`, borderLeft: `2px solid ${event.color}`}}>
        <div className="flex-1">
          <h4 className="text-lg font-semibold">{event.title}</h4>

          {event.description && <p className="text-base text-gray-400 line-clamp-3">{event.description}</p>}

          {/* TODO: add correct calendar */}
          <div
            className="w-fit text-xs/[1] rounded-[20px] px-1.5 py-1 mt-1.5 font-medium"
            style={{backgroundColor: 'rgba(74, 108, 247, 0.3)', color: 'rgb(74, 108, 247)'}}>
            Work
          </div>
        </div>

        {showItemControls && (
          <div className="flex gap-2">
            <Button onClick={handleOpen} endIcon={<EditIcon size="size-4" />} className="w-fit" />
            <Button
              variant="red-bordered"
              onClick={handleDeleteEvent}
              endIcon={<DeleteIcon size="size-4" />}
              className="w-fit"
            />
          </div>
        )}

        {/* TODO: add d&d */}
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

export default EventsListItem;
