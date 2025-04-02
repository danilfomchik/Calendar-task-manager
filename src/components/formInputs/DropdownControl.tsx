import {memo} from 'react';
import {Control, useController} from 'react-hook-form';

import Dropdown from '../inputs/Dropdown';

type DropdownControlProps = {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    options: string[];
    selectedOption?: string;
};

const DropdownControl = ({name, control, selectedOption = '', ...restProps}: DropdownControlProps) => {
    const {field} = useController({
        name,
        control,
        defaultValue: selectedOption,
    });

    return <Dropdown field={field} onChange={field.onChange} selectedOption={field.value} {...restProps} />;
};

export default memo(DropdownControl);
