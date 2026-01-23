import {ChangeEvent} from 'react';
import {ControllerRenderProps, FieldValues} from 'react-hook-form';

export type TTextareaProps = {
  field?: ControllerRenderProps<FieldValues, string>;
  value?: string | number | readonly string[] | undefined;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  defaultValue?: string | undefined;
};
