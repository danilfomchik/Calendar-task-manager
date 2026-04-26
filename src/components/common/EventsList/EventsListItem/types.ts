import {TEvent} from '@/redux/events/types';

export interface IEventsListItemProps {
  event: TEvent;
  showItemControls: boolean;
  isDisabled?: boolean;
}
