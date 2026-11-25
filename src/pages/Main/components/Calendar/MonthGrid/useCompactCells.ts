import {RefObject, useCallback, useState} from 'react';

import {useMeasure} from '@/hooks/useMeasure';
import {remToPx} from '@/services/dom';

import {DAYS_IN_WEEK} from './constants';

// Under this cell width a chip's title truncates to a few letters ("Desig…") and "+N" crowds the numeral ("10+6"), so
// the cells switch to calendar-coloured bars. 5.5rem (88px at the default 16px root) keeps about nine characters of title per
// chip. In rem because the rule is about characters: with a raised browser font size the caption is wider, so the same
// pixel width holds fewer of them and the bars come in sooner.
const COMPACT_CELL_WIDTH_REM = 5.5;

// Measures the desktop Month grid once (not each of its 42 cells) and says whether its cells are too narrow for chips:
// between md and about 1100px with the Agenda panel open, worse with the sidebar open too. Measured before paint, so
// chips never flash in first.
export const useCompactCells = (gridRef: RefObject<HTMLDivElement | null>, isEnabled: boolean) => {
  const [isCompact, setIsCompact] = useState(false);

  const measure = useCallback(
    (grid: HTMLDivElement) => setIsCompact(grid.clientWidth / DAYS_IN_WEEK < remToPx(COMPACT_CELL_WIDTH_REM)),
    [],
  );

  useMeasure(gridRef, measure, isEnabled);

  return isEnabled && isCompact;
};
