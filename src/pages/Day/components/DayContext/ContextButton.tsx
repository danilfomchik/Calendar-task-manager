import {useDayContext} from './DayContextState';
import {DAY_CONTEXT_BUTTON_ID, DAY_CONTEXT_SHEET_ID} from './constants';

// Mobile floating button (sits above the floating Add event) that opens the Day context Bottom sheet
const ContextButton = () => {
  const {isSheetOpen, openSheet} = useDayContext();

  return (
    <button
      id={DAY_CONTEXT_BUTTON_ID}
      type="button"
      aria-label="Day context"
      aria-expanded={isSheetOpen}
      aria-controls={DAY_CONTEXT_SHEET_ID}
      aria-haspopup="dialog"
      onClick={openSheet}
      className="flex size-14 cursor-pointer flex-col items-center justify-center gap-0.5 border border-action bg-surface-raised text-action shadow-lg active:bg-surface-overlay">
      <span aria-hidden className="text-xl leading-none">
        ✦
      </span>
      <span aria-hidden className="font-mono text-[9px] tracking-wider uppercase">
        Context
      </span>
    </button>
  );
};

export default ContextButton;
