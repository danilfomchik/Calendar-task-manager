import {ChangeEvent, HTMLProps, useCallback, useEffect, useState} from 'react';

import {TEXT_FIELD_CLASS} from '@/services/styles';
import {cx} from '@/services/utils';

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
        className={cx('min-h-20 max-h-40 resize-y', TEXT_FIELD_CLASS, className)}
        {...restProps}
      />
    </>
  );
};

export default Textarea;
