import {TEvent} from '@/redux/events/types';

export type TEventProps = {
  event: TEvent;
  eventRef: (el: HTMLButtonElement | null) => void;
  eventIndex: number;
  isDisabled?: boolean;
};
