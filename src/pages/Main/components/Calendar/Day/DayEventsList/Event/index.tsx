import {memo} from 'react';

import EventForm from '@/components/common/EventForm';
import {FormActionType} from '@/components/common/EventForm/types';
import Modal from '@/components/common/Modal';
import Tooltip from '@/components/ui/Tooltip';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {useOpeningItem} from '@/hooks/useOpeningItem';

import {TEventProps} from './types';

const Event = ({event, eventRef}: TEventProps) => {
  const {ref, isOpen, handleClose, handleOpen} = useOpeningItem();

  const isMobileScreen = useMediaQuery({size: 'md', direction: 'to'});

  return (
    <>
      <Tooltip
        disabled={isMobileScreen}
        triggerElement={
          <div
            ref={eventRef}
            className="h-[8px] w-[8px] flex-none rounded-full"
            style={{backgroundColor: event.color}}
            onClick={() => {
              if (isMobileScreen) return;

              handleOpen();
            }}></div>
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

export default memo(Event);
