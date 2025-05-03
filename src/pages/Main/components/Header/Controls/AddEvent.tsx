import Button from '@/components/Button';
import Modal from '@/components/Modal';
import NewEventByDateForm from '@/components/forms/NewEventByDateForm';
import {useOpeningItem} from '@/services/hooks';

const AddEvent = () => {
    const {ref, isOpen, handleClose, handleOpen} = useOpeningItem();

    return (
        <>
            <Button
                variant="secondary"
                text="Add event"
                onClick={handleOpen}
                className="text-sm py-[8px] px-[12px] max-md:w-full"
            />

            {isOpen && (
                <Modal refItem={ref} onClose={handleClose}>
                    <NewEventByDateForm handleModalClose={handleClose} />
                </Modal>
            )}
        </>
    );
};

export default AddEvent;
