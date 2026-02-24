import {memo, useCallback, useEffect, useRef, useState} from 'react';

import {useOpeningItem} from '@/hooks/useOpeningItem';
import ArrowDown from '@/icons/ArrowDown';
import CheckIcon from '@/icons/CheckIcon';
import {cx} from '@/services/utils';

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

  const {isOpen, handleClose, handleToggle} = useOpeningItem();
  const activeOptionRef = useRef<HTMLLIElement>(null);

  const handleChange = useCallback(
    (option: string) => {
      onChange?.(option);
      field?.onChange?.(option);

      setCurrentValue(option);

      handleClose();
    },
    [field, handleClose, onChange],
  );

  const initValue = useCallback(() => {
    setCurrentValue(selectedOption || field?.value || '');
  }, [selectedOption, field]);

  useEffect(() => {
    initValue();
  }, [initValue]);

  useEffect(() => {
    if (isOpen && activeOptionRef.current) {
      activeOptionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isOpen, activeOptionRef]);

  return (
    <div className={cx('w-full relative', className)}>
      <Button
        className={cx('py-2 w-full h-full text-left border-secondaryBackgroundColor z-30', {
          'border-sky-500 text-sky-500': isOpen,
        })}
        text={currentValue ? currentValue : placeholder}
        endIcon={
          <div
            className={cx('transition-transform', {
              'rotate-180': isOpen,
            })}>
            <ArrowDown size="size-4" />
          </div>
        }
        onClick={handleToggle}
        type="button"
      />

      {isOpen && (
        <>
          <div
            onClick={e => {
              e.stopPropagation();

              handleClose();
            }}
            className="fixed w-full h-full inset-0 z-20"
          />

          <ul className="absolute mt-1 w-full bg-mainBackgroundColor border border-secondaryBackgroundColor shadow-lg max-h-[220px] rounded-md text-sm ring-opacity-5 overflow-auto focus:outline-none z-30">
            {options.map(option => (
              <li
                ref={currentValue === option ? activeOptionRef : null}
                key={option}
                className={cx(
                  {
                    'bg-secondaryBackgroundColor': currentValue === option,
                  },
                  'transition-all flex items-center justify-between gap-1 cursor-pointer text-white select-none relative py-2 px-3 hover:bg-secondaryBackgroundColor',
                )}
                onClick={() => handleChange(option)}>
                <span className="font-normal block truncate">{option}</span>
                {currentValue === option && <CheckIcon size="size-3" />}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default memo(Dropdown);
