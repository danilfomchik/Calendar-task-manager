import {useEffect, useRef} from 'react';

import Sheet from '@/components/common/Sheet';

import DayContextBlocks from '../DayContextBlocks';
import {useDayContext} from '../DayContextState';
import {DAY_CONTEXT_BUTTON_ID, DAY_CONTEXT_SHEET_ID} from '../constants';
import {PanelBottomIcon} from '../icons';
import {TDayContextSheetProps} from './types';

// Mobile Bottom sheet with the drawer's blocks, on the shared Sheet: closed it is hidden (the Context button is
// its trigger), open it closes on Esc, backdrop and a downward drag.
const DayContextSheet = ({date}: TDayContextSheetProps) => {
  const {isSheetOpen, openSheet, closeSheet} = useDayContext();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isSheetOpen) {
      closeButtonRef.current?.focus();
    } else if (document.getElementById(DAY_CONTEXT_SHEET_ID)?.contains(document.activeElement)) {
      document.getElementById(DAY_CONTEXT_BUTTON_ID)?.focus();
    }
  }, [isSheetOpen]);

  return (
    <Sheet
      id={DAY_CONTEXT_SHEET_ID}
      label="Day context"
      modal
      isOpen={isSheetOpen}
      onOpenChange={open => (open ? openSheet() : closeSheet())}
      layerClassName="fixed z-40 md:hidden"
      className="bg-surface-base shadow-lg">
      {({startDrag, guardClick, close}) => (
        <>
          <div onPointerDown={startDrag} className="shrink-0 cursor-grab touch-none">
            <span aria-hidden className="mx-auto mt-2 block h-1 w-10 bg-line-strong" />
            <div className="flex items-center justify-between gap-3 pl-4">
              <h2 className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-action uppercase">
                <PanelBottomIcon />
                Day context
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={guardClick(close)}
                className="flex min-h-11 cursor-pointer items-center px-4 font-mono text-xs tracking-wider text-text-muted uppercase hover:text-text">
                Close
              </button>
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto overscroll-contain px-3 pb-6">
            <DayContextBlocks date={date} />
          </div>
        </>
      )}
    </Sheet>
  );
};

export default DayContextSheet;
