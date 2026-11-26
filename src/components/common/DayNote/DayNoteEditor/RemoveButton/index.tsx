import CloseIcon from '@/components/ui/icons/CloseIcon';
import {cx} from '@/services/utils';

import {TRemoveButtonProps} from './types';

// shared by the button and its empty slot, so the row's text never re-wraps when it appears
const SLOT_CLASS = '-my-0.5 -mr-1 size-6 shrink-0';

// Removes the whole Day note in one click, at the right edge of the row. Muted until hovered or focused, then rose.
// Mouse-down is cancelled so pressing it while typing keeps focus in the textarea; where a browser blurs anyway the
// button stays mounted (DayNoteEditor keeps it a stable sibling), so the click still lands.
const RemoveButton = ({onClick, isAvailable}: TRemoveButtonProps) =>
  isAvailable ? (
    <button
      type="button"
      aria-label="Remove day note"
      title="Remove note"
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      className={cx(
        SLOT_CLASS,
        'grid cursor-pointer place-items-center text-text-faint transition-colors hover:text-danger focus-visible:text-danger focus-visible:outline-offset-0! motion-reduce:transition-none',
      )}>
      <CloseIcon aria-hidden className="size-3.5" />
    </button>
  ) : (
    <span aria-hidden className={SLOT_CLASS} />
  );

export default RemoveButton;
