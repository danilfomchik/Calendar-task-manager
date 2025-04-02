import {yupResolver} from '@hookform/resolvers/yup';
import {FormProvider, useForm} from 'react-hook-form';

import Button from '@/components/Button';
import InputControl from '@/components/formInputs/InputControl';
import CheckIcon from '@/icons/CheckIcon';
import CloseIcon from '@/icons/CloseIcon';
import EditIcon from '@/icons/EditIcon';

import {validation} from './form';
import {TEditFormProps} from './types';

const BoardItemForm = ({actionType = 'edit', formTitle, defaultValues, onSubmit, handleModalClose}: TEditFormProps) => {
    const methods = useForm({
        resolver: yupResolver(validation),
        defaultValues: defaultValues || {field: ''},
        mode: 'onSubmit',
    });

    const {
        control,
        handleSubmit,
        formState: {errors, isDirty},
    } = methods;

    return (
        <div className="modal relative bg-mainBackgroundColor border border-sky-500 rounded-lg md:min-w-96 sm:min-w-56">
            <Button
                startIcon={<CloseIcon size="size-5" />}
                className="absolute right-2 top-2 p-1 text-sm cursor-pointer hover:text-sky-500"
                onClick={handleModalClose}
            />

            <h3 className="text-lg font-bold p-3 text-center">{formTitle}</h3>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col items-center justify-between gap-[20px] w-auto px-[30px] py-[20px]">
                        <div className="flex flex-col gap-1 w-full">
                            <InputControl autoFocus control={control} name="field" />
                        </div>

                        <Button
                            className={`${isDirty && !errors.field && 'border-sky-500 text-sky-500'} text-sm p-2 `}
                            disabled={!isDirty || !!errors.field}
                            text={actionType === 'edit' ? 'Edit' : 'Add'}
                            endIcon={actionType === 'edit' ? <EditIcon size="size-5" /> : <CheckIcon size="size-5" />}
                            type="submit"
                        />
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default BoardItemForm;
