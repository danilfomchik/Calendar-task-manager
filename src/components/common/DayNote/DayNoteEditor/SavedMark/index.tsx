import CheckIcon from '@/components/ui/icons/CheckIcon';
import {cx} from '@/services/utils';

import {TSavedMarkProps} from './types';

// The autosave confirmation: a green check that fades in at the right edge of the Day note row. It always occupies
// its 16px slot (mirroring the note icon on the left), so showing or hiding it never narrows the text or re-wraps it.
// The status text is for screen readers only.
const SavedMark = ({isSaved}: TSavedMarkProps) => (
  <span role="status" className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center text-action">
    <CheckIcon
      aria-hidden
      strokeWidth={1.75}
      className={cx(
        'size-3.5 transition-opacity duration-300 motion-reduce:transition-none',
        isSaved ? 'opacity-100' : 'opacity-0',
      )}
    />
    <span className="sr-only">{isSaved ? 'Saved' : ''}</span>
  </span>
);

export default SavedMark;
