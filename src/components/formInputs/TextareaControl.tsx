import {ErrorMessage} from '@hookform/error-message';
import {HTMLProps, memo} from 'react';
import {Control, get, useController, useFormContext} from 'react-hook-form';

import Textarea from '../inputs/Textarea';

type TextareaControlProps = {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    defaultValue?: string;
};

const TextareaControl = ({
    name,
    control,
    defaultValue = '',
    ...restProps
}: HTMLProps<HTMLTextAreaElement> & TextareaControlProps) => {
    const {
        formState: {errors},
    } = useFormContext();

    const {field} = useController({
        name,
        control,
        defaultValue,
    });

    const errorProps = {
        error: Boolean(get(errors, name)),
        helperText: <ErrorMessage errors={errors} name={name} render={({message}) => message} />,
    };

    return (
        <>
            <Textarea
                field={field}
                onChange={field.onChange}
                value={field.value}
                aria-invalid={errorProps.error}
                {...restProps}
            />
            {errorProps.error && (
                <p role="alert" className="text-rose-500 text-xs pl-1">
                    {errorProps.helperText}
                </p>
            )}
        </>
    );
};

export default memo(TextareaControl);
