import {TDirection} from '@/services/dateUtils';

export type TWeekStripProps = {
  date: string;
  // weeks away from the Viewed day's week (mobile swipe); 0 on desktop
  weekOffset?: number;
  // chevrons (desktop) step by a week
  onStep: (direction: TDirection) => void;
  // given on mobile only: the strip also swipes by a week
  onSwipe?: (direction: TDirection) => void;
};
