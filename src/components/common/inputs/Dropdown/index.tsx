import {KeyboardEvent, PropsWithChildren, memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import ArrowDown from '@/components/ui/icons/ArrowDown';
import CheckIcon from '@/components/ui/icons/CheckIcon';
import {useOpeningItem} from '@/hooks/useOpeningItem';
import {cx} from '@/services/utils';

import Button from '../../Button';
import {TDropdownProps} from './types';

// TODO: refactor component and props.
// currently selectedOption looks weird
const Dropdown = ({
  field,
  selectedOption,
  onChange,
  options,
  placeholder = 'Choose an option',
  className = '',
  wrapperClassName = '',
  triggerClassName = '',
  customOption,
  children,
}: PropsWithChildren<TDropdownProps>) => {
  const [currentValue, setCurrentValue] = useState(selectedOption);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const {isOpen, handleClose, handleToggle} = useOpeningItem();
  const activeOptionRef = useRef<HTMLLIElement>(null);

  const btnText = useMemo(() => {
    if (!currentValue) return placeholder;
    if (!customOption) return currentValue;

    return customOption(currentValue);
  }, [currentValue, customOption, placeholder]);

  const dropdownClassName = cx(
    'absolute mt-1 w-full bg-mainBackgroundColor border border-secondary-background-color shadow-lg max-h-55 rounded-md text-sm ring-opacity-5 overflow-auto focus:outline-none z-101',
    className,
  );

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

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLLIElement>, index: number) => {
    let newIndex = index;

    if (event.key === 'ArrowDown') {
      newIndex = (index + 1) % options.length;
    } else if (event.key === 'ArrowUp') {
      newIndex = (index - 1 + options.length) % options.length;
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleChange(options[index]);
      return;
    } else {
      return; // Ignore other keys
    }

    event.preventDefault();
    setFocusedIndex(newIndex);

    // Shift focus to the newly active DOM element
    document.getElementById(`list-item-${newIndex}`)?.focus();
  };

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
    <div className={cx('w-full relative', wrapperClassName)}>
      <Button
        className={cx(
          'py-2 w-full h-full text-left border-line z-30 outline-none focus:border-action',
          {
            'border-action text-action': isOpen,
          },
          triggerClassName,
        )}
        text={btnText}
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
            className="fixed w-full h-full inset-0 z-100"
          />

          {children ? (
            <div className={dropdownClassName}>{children}</div>
          ) : (
            <ul
              role="listbox"
              aria-label={field?.name ? `${field.name} dropdown list` : 'Dropdown list'}
              className={dropdownClassName}>
              {options.map((option, index) => (
                <li
                  id={`list-item-${index}`}
                  ref={currentValue === option ? activeOptionRef : null}
                  key={option}
                  tabIndex={focusedIndex === index ? 0 : -1}
                  role="option"
                  aria-selected={focusedIndex === index}
                  onKeyDown={e => handleOptionKeyDown(e, index)}
                  className={cx(
                    {
                      'bg-secondary-background-color': currentValue === option,
                    },
                    'transition-all flex items-center justify-between gap-1 cursor-pointer text-white select-none relative py-2 px-3 hover:bg-secondary-background-color focus:bg-secondary-background-color outline-none',
                  )}
                  onClick={() => handleChange(option)}>
                  {customOption ? customOption(option) : <span className="font-normal block truncate">{option}</span>}

                  {currentValue === option && (
                    <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 size-3" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default memo(Dropdown);
