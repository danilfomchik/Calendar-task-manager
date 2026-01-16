export type TFormFields = {
  eventName: string;
  eventDescription?: string;
};

export type TBoardEventFormProps = {
  actionType?: 'edit' | 'add';
  formTitle: string;
  defaultValues?: TFormFields;
  date: string;
  handleModalClose: () => void;
};
