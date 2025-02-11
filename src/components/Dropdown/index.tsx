import {TDropdownProps} from './types';
import CheckIcon from '@/icons/CheckIcon';
import ArrowDown from '@/icons/ArrowDown';
import {useBodyClick} from '@/services/hooks';

const Dropdown = ({
    selectedOption,
    changeSelectedOption,
    options,
    placeholder = 'placeholder',
    className = '',
}: TDropdownProps) => {
    const {ref: dropDownRef, isOpen: isDrowDownOpen, setIsOpen: setIsDrowDownOpen} = useBodyClick();

    const toggleDropdown = () => {
        setIsDrowDownOpen(prev => !prev);
    };

    const handleChange = (option: string) => {
        changeSelectedOption(option);
    };

    return (
        <div ref={dropDownRef} className={`relative ${className}`}>
            <button
                className="w-full h-full cursor-pointer bg-mainBackgroundColor rounded-md border transition duration-500 ease-in-out hover:border-sky-500 border-secondaryBackgroundColor px-3 py-2 text-left focus:oulline-none focus:right-0 focus:border-sky-500"
                onClick={toggleDropdown}>
                <div className="flex items-center justify-between gap-2 w-full">
                    {selectedOption ? (
                        <span className="font-normal block truncate text-white">{selectedOption}</span>
                    ) : (
                        <span className="font-normal block truncate text-gray-400">{placeholder}</span>
                    )}
                    <div className={`transition duration-150 ease-in-out ${isDrowDownOpen && 'rotate-180'}`}>
                        <ArrowDown size="size-4" />
                    </div>
                </div>
            </button>
            {isDrowDownOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-mainBackgroundColor border border-secondaryBackgroundColor shadow-lg max-h-[220px] rounded-md text-sm ring-opacity-5 overflow-auto focus:outline-none">
                    {options.map(option => (
                        <li
                            key={option}
                            className={`${selectedOption === option && 'bg-secondaryBackgroundColor'} transition-all flex items-center justify-between gap-1 cursor-pointer text-white select-none relative py-2 px-3 hover:bg-secondaryBackgroundColor`}
                            onClick={() => handleChange(option)}>
                            <span className="font-normal block truncate">{option}</span>
                            {selectedOption === option && <CheckIcon size="size-3" />}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
