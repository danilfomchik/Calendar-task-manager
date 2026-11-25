import {flushSync} from 'react-dom';

// The Month grid's day cells carry `data-day="YYYY-MM-DD"` (Calendar/Day); these find them by date.
export const dayCellSelector = (date: string) => `[data-day="${date}"]`;

// Applies a state change that shows `date`'s cell synchronously, then focuses that cell. Used where the control that
// was pressed goes away with the change, so focus lands on the day rather than on <body>.
export const focusDayCellAfter = (date: string, update: () => void) => {
  flushSync(update);
  document.querySelector<HTMLButtonElement>(dayCellSelector(date))?.focus({preventScroll: true});
};
