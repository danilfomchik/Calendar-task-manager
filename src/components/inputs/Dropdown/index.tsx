import {memo, useCallback, useEffect, useState} from 'react';

import ArrowDown from '@/icons/ArrowDown';
import CheckIcon from '@/icons/CheckIcon';
import {useOverflow, useRegisteredItem} from '@/services/hooks';

import Button from '../../Button';
import {TDropdownProps} from './types';

const Dropdown = ({
    field,
    selectedOption,
    onChange,
    options,
    placeholder = 'Choose an option',
    className = '',
}: TDropdownProps) => {
    const [currentValue, setCurrentValue] = useState(selectedOption);

    const {ref, refId, handleClose, handleToggle} = useOverflow();
    const isOpen = useRegisteredItem({refId});

    const handleChange = useCallback(
        (option: string) => {
            onChange?.(option);
            field?.onChange?.(option);

            setCurrentValue(option);

            setTimeout(() => {
                handleClose();
            }, 0);
        },
        [field, handleClose, onChange],
    );

    const initValue = useCallback(() => {
        setCurrentValue(selectedOption || field?.value || '');
    }, [selectedOption, field]);

    useEffect(() => {
        initValue();
    }, [initValue]);

    return (
        <div ref={ref} className={`w-full relative ${className}`}>
            <Button
                className={`py-2 w-full h-full text-left ${isOpen ? 'border-sky-500 text-sky-500' : 'border-secondaryBackgroundColor'}`}
                text={currentValue ? currentValue : placeholder}
                endIcon={
                    <div className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                        <ArrowDown size="size-4" />
                    </div>
                }
                onClick={handleToggle}
                type="button"
            />

            {isOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-mainBackgroundColor border border-secondaryBackgroundColor shadow-lg max-h-[220px] rounded-md text-sm ring-opacity-5 overflow-auto focus:outline-none">
                    {options.map(option => (
                        <li
                            key={option}
                            className={`${currentValue === option && 'bg-secondaryBackgroundColor'} transition-all flex items-center justify-between gap-1 cursor-pointer text-white select-none relative py-2 px-3 hover:bg-secondaryBackgroundColor`}
                            onClick={() => handleChange(option)}>
                            <span className="font-normal block truncate">{option}</span>
                            {currentValue === option && <CheckIcon size="size-3" />}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default memo(Dropdown);
