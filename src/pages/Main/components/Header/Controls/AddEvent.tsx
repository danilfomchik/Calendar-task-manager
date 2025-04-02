import Button from '@/components/Button';
import Modal from '@/components/Modal';
import NewEventByDateForm from '@/components/forms/NewEventByDateForm';
import {useModal} from '@/services/hooks';

const AddEvent = () => {
    const {isOpen, handleModalClose, handleModalOpen} = useModal();

    return (
        <>
            <Button
                variant="secondary"
                text="Add event"
                onClick={handleModalOpen}
                className="text-sm py-[8px] px-[12px] max-md:w-full"
            />

            {isOpen && (
                <Modal onClose={handleModalClose}>
                    <NewEventByDateForm handleModalClose={handleModalClose} />
                </Modal>
            )}
        </>
    );
};

export default AddEvent;
