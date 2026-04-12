import Button from '@/components/common/Button';
import EventForm from '@/components/common/EventForm';
import Modal from '@/components/common/Modal';
import {useOpeningItem} from '@/hooks/useOpeningItem';
import {cx} from '@/services/utils';

const AddEvent = ({date, className}: {date?: string; className?: string}) => {
  const {ref, isOpen, handleClose, handleOpen} = useOpeningItem();

  return (
    <>
      <Button
        variant="secondary"
        text="Add event"
        onClick={handleOpen}
        className={cx('text-sm py-[8px] px-[12px] max-md:w-full', className)}
      />

      {isOpen && (
        <Modal refItem={ref} onClose={handleClose}>
          <EventForm formTitle="Create event form" handleModalClose={handleClose} date={date} />
        </Modal>
      )}
    </>
  );
};

export default AddEvent;
