import {ChangeEvent, HTMLProps, useCallback, useEffect, useState} from 'react';

import {TInputProps} from './types';

const Input = ({
    field,
    value,
    defaultValue = '',
    onChange,
    type = 'text',
    placeholder = 'Fill in the required field',
    ...restProps
}: TInputProps & HTMLProps<HTMLInputElement>) => {
    const [currentValue, setCurrentValue] = useState(defaultValue);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const eventValue = e.target.value;

            onChange?.(e);
            field?.onChange?.(eventValue);

            setCurrentValue(eventValue);
        },
        [field, onChange],
    );

    const initValue = useCallback(() => {
        setCurrentValue(value || field?.value || '');
    }, [value, field]);

    useEffect(() => {
        initValue();
    }, [initValue]);

    return (
        <>
            <input
                {...field}
                value={currentValue}
                onChange={handleChange}
                type={type}
                placeholder={placeholder}
                className="bg-black w-full focus:border-sky-500 border rounded outline-none px-[15px] py-[10px]"
                {...restProps}
            />
        </>
    );
};

export default Input;
