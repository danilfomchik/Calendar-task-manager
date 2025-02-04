import {TColumn} from '@/redux/columns/types';

export type TEditTitleFormProps = {
    column: TColumn;
    onCloseEditMode: () => void;
};

export type TFormValues = {
    title: string;
};
