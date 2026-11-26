import {gridArrowSteps} from '@/services/gridKeyboard';

// The Month grid's columns, one per weekday
export const DAYS_IN_WEEK = 7;

// how far each arrow key moves focus in the Month grid
export const GRID_ARROW_STEPS = gridArrowSteps(DAYS_IN_WEEK);
