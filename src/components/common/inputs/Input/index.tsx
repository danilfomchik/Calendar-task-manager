import {ChangeEvent, HTMLProps, useCallback, useEffect, useRef, useState} from 'react';

import {TEXT_FIELD_CLASS} from '@/services/styles';

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
  const inputRef = useRef<HTMLInputElement>(null);

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
        ref={inputRef}
        value={currentValue}
        onChange={handleChange}
        type={type}
        placeholder={placeholder}
        className={TEXT_FIELD_CLASS}
        {...restProps}
      />
    </>
  );
};

export default Input;
