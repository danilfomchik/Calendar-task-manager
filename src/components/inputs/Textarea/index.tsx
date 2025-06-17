import cn from 'classnames';
import {ChangeEvent, HTMLProps, useCallback, useEffect, useState} from 'react';
import {twMerge} from 'tailwind-merge';

import {TTextareaProps} from './types';

const Textarea = ({
    field,
    value,
    defaultValue = '',
    onChange,
    placeholder = 'Fill in the required field',
    className,
    ...restProps
}: TTextareaProps & HTMLProps<HTMLTextAreaElement>) => {
    const [currentValue, setCurrentValue] = useState(defaultValue);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLTextAreaElement>) => {
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
            <textarea
                {...field}
                value={currentValue}
                onChange={handleChange}
                placeholder={placeholder}
                className={twMerge(
                    cn(
                        'max-h-[150px]m min-h-[46px] bg-black w-full focus:border-sky-500 border rounded outline-none px-[15px] py-[10px]',
                        className,
                    ),
                )}
                {...restProps}
            />
        </>
    );
};

export default Textarea;
