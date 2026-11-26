import {TEvent} from '@/redux/events/types';

export type TDayEventsListProps = {
  events: TEvent[];
  date: string;
  // chips show each event's title; bars (a narrow desktop cell) show only its calendar colour
  variant?: 'chips' | 'bars';
  className?: string;
};
