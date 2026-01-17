import {TEvent} from '@/redux/events/types';

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
  eventName: string;
  eventYear: string;
  eventMonth: string;
  eventDay: string;
  eventDescription?: string;
};
