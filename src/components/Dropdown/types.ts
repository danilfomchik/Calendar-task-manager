import {ControllerRenderProps, FieldValues} from 'react-hook-form';

export type Option = {
    value: string;
};

export type TDropdownProps = {
    field?: ControllerRenderProps<FieldValues, string>;
    selectedOption?: string;
    changeSelectedOption: (option: string) => void;
    options: string[];
    placeholder: string;
    value?: unknown;
    className?: string;
};
