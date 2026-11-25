import PlusIcon from '@/components/ui/icons/PlusIcon';
import {useOpenEventForm} from '@/hooks/useOpenEventForm';

import {TAddEventDayButtonProps} from './types';

// Home's green Add event, bound to the Viewed day instead of the selected date.
// `floating` is the mobile square button; the Day page places it in the bottom-right floating stack.
const AddEventDayButton = ({date, floating = false}: TAddEventDayButtonProps) => {
  const {openCreate} = useOpenEventForm();

  const handleOpen = () => openCreate(date);

  if (floating) {
    return (
      <button
        type="button"
        aria-label="Add event"
        title="Add event"
        onClick={handleOpen}
        className="flex size-14 cursor-pointer items-center justify-center bg-action text-action-ink shadow-fab active:brightness-110">
        <PlusIcon size="size-6" strokeWidth={2} aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 bg-action px-3 text-para-s text-action-ink hover:brightness-110">
      <PlusIcon size="size-4" aria-hidden />
      Add event
    </button>
  );
};

export default AddEventDayButton;
