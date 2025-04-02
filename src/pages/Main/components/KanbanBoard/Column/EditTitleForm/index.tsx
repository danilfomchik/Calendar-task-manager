import {yupResolver} from '@hookform/resolvers/yup';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';

import Button from '@/components/Button';
import InputControl from '@/components/formInputs/InputControl';
import CheckIcon from '@/icons/CheckIcon';
import CloseIcon from '@/icons/CloseIcon';
import {updateColumnTitle} from '@/redux/columns/columnsSlice';

import {validation} from './form';
import {TEditTitleFormProps, TFormValues} from './types';

const EditTitleForm = ({column, onCloseEditMode}: TEditTitleFormProps) => {
    const dispatch = useDispatch();
    const methods = useForm<TFormValues>({
        resolver: yupResolver(validation),
        defaultValues: {
            title: column.title,
        },
        mode: 'onSubmit',
    });

    const {
        control,
        handleSubmit,
        formState: {isDirty},
    } = methods;

    const onSubmit: SubmitHandler<TFormValues> = data => {
        dispatch(updateColumnTitle({columnId: column.id, newTitle: data.title}));
        onCloseEditMode();
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center justify-between gap-[20px] w-auto">
                    <div className="flex self-stretch my-[6px]">
                        <InputControl autoFocus control={control} name="title" />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            className="text-sm p-2 disabled:hover:border-secondaryBackgroundColor disabled:text-secondaryBackgroundColor disabled:hover:text-secondaryBackgroundColor disabled:cursor-auto"
                            disabled={!isDirty}
                            endIcon={<CheckIcon size="size-5" />}
                            type="submit"
                        />
                        <Button
                            className="text-sm p-2"
                            startIcon={<CloseIcon size="size-5" />}
                            onClick={onCloseEditMode}
                        />
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};

export default EditTitleForm;
