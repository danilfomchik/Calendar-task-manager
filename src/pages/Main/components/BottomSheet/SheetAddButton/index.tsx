import moment from 'moment';

import PlusIcon from '@/components/ui/icons/PlusIcon';
import {useOpenCreateEvent} from '@/pages/Main/hooks/useOpenCreateEvent';
import {stopPropagation} from '@/services/dom';

import {TSheetAddButtonProps} from './types';

// The Bottom sheet's add action, docked at the right end of its date row: a 44px green square that sits beside the day
// it adds to, so it never covers an event row and is there collapsed and expanded alike. The row is a drag area, so
// pressing the button never moves the sheet. Its name says which day it adds to, since the plus alone does not.
const SheetAddButton = ({date}: TSheetAddButtonProps) => {
  const openCreateEvent = useOpenCreateEvent();

  return (
    <button
      type="button"
      aria-label={`Add event to ${moment(date).format('D MMMM')}`}
      title="Add event"
      onPointerDown={stopPropagation}
      onClick={openCreateEvent}
      // ml: Open day's 44px hit area hangs 8px (14px under 20rem of row) past its arrow, so the gap keeps the two apart
      className="relative z-20 flex size-11 shrink-0 cursor-pointer items-center justify-center self-center bg-action text-action-ink transition-[filter] hover:brightness-110 active:brightness-90 @max-xs:ml-1.5">
      <PlusIcon size="size-5" strokeWidth={2} aria-hidden />
    </button>
  );
};

export default SheetAddButton;
