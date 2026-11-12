import {ReactNode} from 'react';
import {ControllerRenderProps, FieldValues} from 'react-hook-form';

export type Option = {
  value: string;
};

// TODO: add correct types:
// if children passed -> no need options
// etc (check for other types)

export type TDropdownBaseProps = {
  name?: string;
  options: string[];
  selectedOption?: string;
  customOption?: (option: string) => string | ReactNode;
  className?: string;
  wrapperClassName?: string;
  triggerClassName?: string;
};

export type TDropdownProps = {
  field?: ControllerRenderProps<FieldValues, string>;
  onChange?: (option: string) => void;
  placeholder?: string;
  setDropDownRef?: (node: HTMLDivElement | null) => void;
} & TDropdownBaseProps;
