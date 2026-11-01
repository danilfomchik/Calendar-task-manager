import {TEvent} from '@/redux/events/types';

export type TEventProps = {
  event: TEvent;
  isDisabled?: boolean;
};
