import PlusIcon from '@/components/ui/icons/PlusIcon';
import {useOpenCreateEvent} from '@/pages/Main/hooks/useOpenCreateEvent';
import {PRIMARY_ACTION_CLASS} from '@/services/styles';

// Solid green primary action of the home header, always shown from md: it adds to the selected day, which the open
// Agenda panel names in its heading
const AddEventButton = () => {
  const openCreateEvent = useOpenCreateEvent();

  return (
    <button type="button" onClick={openCreateEvent} className={PRIMARY_ACTION_CLASS}>
      <PlusIcon size="size-4" aria-hidden />
      Add event
    </button>
  );
};

export default AddEventButton;
