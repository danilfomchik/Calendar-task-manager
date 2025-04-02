import {ControllerRenderProps, FieldValues} from 'react-hook-form';

export type Option = {
    value: string;
};

export type TDropdownProps = {
    field?: ControllerRenderProps<FieldValues, string>;
    selectedOption?: string;
    onChange: (option: string) => void;
    name?: string;
    options: string[];
    placeholder?: string;
    className?: string;
    setDropDownRef?: (node: HTMLDivElement | null) => void;
};
