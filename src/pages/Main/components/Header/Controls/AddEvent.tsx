import Button from '@/components/Button';
import Modal from '@/components/Modal';
import NewEventByDateForm from '@/components/forms/NewEventByDateForm';
import {useOverflow} from '@/services/hooks';

const AddEvent = () => {
    const {ref, isOpen, refId, handleClose, handleOpen} = useOverflow();

    return (
        <>
            <Button
                variant="secondary"
                text="Add event"
                onClick={handleOpen}
                className="text-sm py-[8px] px-[12px] max-md:w-full"
            />

            {isOpen && (
                <Modal refId={refId} refItem={ref} onClose={handleClose}>
                    <NewEventByDateForm handleModalClose={handleClose} />
                </Modal>
            )}
        </>
    );
};

export default AddEvent;
