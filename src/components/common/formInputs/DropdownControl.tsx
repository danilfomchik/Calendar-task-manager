import {memo} from 'react';
import {Control, useController} from 'react-hook-form';

import Dropdown from '../inputs/Dropdown';
import {TDropdownBaseProps} from '../inputs/Dropdown/types';

type DropdownControlProps = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
} & TDropdownBaseProps;

const DropdownControl = ({name, control, selectedOption = '', ...restProps}: DropdownControlProps) => {
  const {field} = useController({
    name,
    control,
    defaultValue: selectedOption,
  });

  return <Dropdown field={field} onChange={field.onChange} selectedOption={field.value} {...restProps} />;
};

export default memo(DropdownControl);
