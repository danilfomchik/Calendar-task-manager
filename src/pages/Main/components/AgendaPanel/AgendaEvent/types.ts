import {TEvent} from '@/redux/events/types';

export type TAgendaEventProps = {
  event: TEvent;
  isDisabled: boolean;
  // briefly set after the event's chip in the Month grid was clicked: the row scrolls into view and is lit
  isHighlighted?: boolean;
};
