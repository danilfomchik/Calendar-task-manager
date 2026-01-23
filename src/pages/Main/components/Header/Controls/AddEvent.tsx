import Button from '@/components/Button';
import EventForm from '@/components/EventForm';
import Modal from '@/components/Modal';
import {useOpeningItem} from '@/hooks/useOpeningItem';

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
          <EventForm formTitle="Create event form" handleModalClose={handleClose} />
        </Modal>
      )}
    </>
  );
};

export default AddEvent;
