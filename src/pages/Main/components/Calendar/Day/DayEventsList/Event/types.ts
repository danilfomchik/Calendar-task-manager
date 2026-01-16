import {TEvent} from '@/redux/events/types';

export type TEventProps = {
  event: TEvent;
  eventRef: (el: HTMLDivElement | null) => void;
  eventIndex: number;
};
