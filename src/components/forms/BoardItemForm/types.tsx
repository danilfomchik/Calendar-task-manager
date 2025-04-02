import {SubmitHandler} from 'react-hook-form';

export type TFormFields = {
    field: string;
};

export type TEditFormProps = {
    actionType?: 'edit' | 'add';
    formTitle: string;
    defaultValues?: TFormFields;
    onSubmit: SubmitHandler<TFormFields>;
    handleModalClose: () => void;
};
