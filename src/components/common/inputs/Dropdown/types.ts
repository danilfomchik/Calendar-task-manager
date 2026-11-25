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

// what a children render function gets: `close` shuts the popup, so a pick inside it can close it like an option
// does (focus then returns to the trigger)
export type TDropdownControls = {
  close: () => void;
};

export type TDropdownProps = {
  field?: ControllerRenderProps<FieldValues, string>;
  onChange?: (option: string) => void;
  placeholder?: string;
  setDropDownRef?: (node: HTMLDivElement | null) => void;
  // children mode only: the popup's accessible name, which also makes it a labelled dialog (focus moves into it on
  // open, to an element marked data-autofocus or else its first control, and returns to the trigger on close)
  dialogLabel?: string;
  // the popup's custom content instead of the options list; a function receives the popup's controls
  children?: ReactNode | ((controls: TDropdownControls) => ReactNode);
} & TDropdownBaseProps;
