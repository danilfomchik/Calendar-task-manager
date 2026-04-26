import {TEvent} from '@/redux/events/types';
import {CalendarsNames} from '@/services/types';

export enum FormActionType {
  edit = 'edit',
  create = 'create',
}

export type TEventFormProps = {
  actionType?: FormActionType;
  formTitle: string;
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
