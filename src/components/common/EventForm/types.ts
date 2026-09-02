import {TEvent} from '@/redux/events/types';
import {FormActionType} from '@/types/eventFormTypes';
import {CalendarsNames} from '@/types/types';

export type TEventFormProps = {
  actionType?: FormActionType;
  event?: TEvent;
  date?: string;
  handleModalClose: () => void;
};

export type TFormValues = {
  eventTitle: string;
  eventYear: string;
  eventMonth: string;
  eventDay: string;
  eventCalendar: CalendarsNames;
  eventDescription?: string;
};
