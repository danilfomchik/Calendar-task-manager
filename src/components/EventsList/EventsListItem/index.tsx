import {useCallback} from 'react';

import Button from '@/components/Button';
import EventForm from '@/components/EventForm';
import {FormActionType} from '@/components/EventForm/types';
import Modal from '@/components/Modal';
import {useOpeningItem} from '@/hooks/useOpeningItem';
import BarsIcon from '@/icons/BarsIcon';
import DeleteIcon from '@/icons/DeleteIcon';
import EditIcon from '@/icons/EditIcon';
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
      <div className="relative flex items-center gap-6 max-md:gap-4 rounded-lg px-4 py-3 border border-secondaryBackgroundColor">
        <div style={{background: event.color}} className="w-2 h-2 rounded-full absolute top-1.5 left-1.5"></div>

        <div className="flex-1">
          <h4 className="text-lg font-semibold">{event.title}</h4>

          {event.description && <p className="text-base text-gray-400 line-clamp-3">{event.description}</p>}
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
