import EventForm from '@/components/EventForm';
import {FormActionType} from '@/components/EventForm/types';
import Modal from '@/components/Modal';
import Tooltip from '@/components/Tooltip';
import {useOpeningItem} from '@/services/hooks';

import {TEventProps} from './types';

const Event = ({event, eventRef}: TEventProps) => {
  const {ref, isOpen, handleClose, handleOpen} = useOpeningItem();

  return (
    <>
      <Tooltip
        triggerElement={
          <div
            ref={eventRef}
            className="h-[8px] w-[8px] flex-none rounded-full"
            style={{backgroundColor: event.color}}
            onClick={handleOpen}></div>
        }
        className="w-auto h-auto"
        contentClassName="whitespace-nowrap text-ellipsis overflow-hidden">
        {event.title}
      </Tooltip>

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

export default Event;
