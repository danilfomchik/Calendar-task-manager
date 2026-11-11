import {FC} from 'react';

// Every Day context block gets the Viewed day and renders itself, or null when it has nothing to show.
// Blocks render in the desktop drawer or in the mobile Bottom sheet (one of the two at a time).
export type DayContextBlockProps = {date: string};
export type DayContextBlock = FC<DayContextBlockProps>;
