import Modal from '@/components/Modal';
import Tooltip from '@/components/Tooltip';
import BoardEventForm from '@/components/forms/BoardEventForm';
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
                    {/* TODO: render event info with edit button (on click render BoardEventForm)
                                
                    // TODO: leave one form (takes default values, type, date - if date null renders date dropdowns (separated component), else - ony fields)*/}
                    <BoardEventForm
                        actionType="edit"
                        formTitle="Edit"
                        handleModalClose={handleClose}
                        date=""
                        defaultValues={{
                            eventName: event.title,
                            eventDescription: event.description,
                        }}
                    />
                </Modal>
            )}
        </>
    );
};

export default Event;
