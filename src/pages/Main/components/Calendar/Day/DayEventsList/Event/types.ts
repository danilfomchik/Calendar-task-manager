import {TEvent} from '@/redux/events/types';

export type TEventProps = {
  event: TEvent;
  // the cell's date, selected when the chip is clicked
  date: string;
  isDisabled?: boolean;
};
