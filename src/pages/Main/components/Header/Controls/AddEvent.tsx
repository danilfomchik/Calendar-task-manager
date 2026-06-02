import Button from '@/components/common/Button';
import EventForm from '@/components/common/EventForm';
import Modal from '@/components/common/Modal';
import PlusIcon from '@/components/ui/icons/PlusIcon';
import {useOpeningItem} from '@/hooks/useOpeningItem';
import {cx} from '@/services/utils';

const AddEvent = ({date, showText = true, className}: {date?: string; showText?: boolean; className?: string}) => {
  const {ref, isOpen, handleClose, handleOpen} = useOpeningItem();

  return (
    <>
      <Button
        variant="secondary"
        text={showText ? 'Add event' : undefined}
        startIcon={<PlusIcon size="size-4" />}
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
