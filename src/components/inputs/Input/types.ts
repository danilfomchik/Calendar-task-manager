import {ChangeEvent} from 'react';
import {ControllerRenderProps, FieldValues} from 'react-hook-form';

export type TInputProps = {
    field?: ControllerRenderProps<FieldValues, string>;
    value?: string | number | readonly string[] | undefined;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    defaultValue?: string | undefined;
};
