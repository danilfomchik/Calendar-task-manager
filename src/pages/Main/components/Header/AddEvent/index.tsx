import {useState} from 'react';

import Button from '@/components/Button';
import Modal from '@/components/Modal';
import NewEventByDateForm from '../../newEventForms/NewEventByDateForm';

const AddEvent = () => {
    const [isAddEvent, setIsAddEvent] = useState(false);

    return (
        <>
            <Button
                variant="secondary"
                text="Add event"
                onClick={() => setIsAddEvent(true)}
                className="text-sm py-[8px] px-[12px] max-md:w-full"
            />

            {isAddEvent && (
                <Modal onClose={() => setIsAddEvent(false)}>
                    <NewEventByDateForm setOpen={setIsAddEvent} />
                </Modal>
            )}
        </>
    );
};

export default AddEvent;
