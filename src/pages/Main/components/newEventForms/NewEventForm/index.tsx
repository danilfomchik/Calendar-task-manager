import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';

import {validation, defaultValues} from './form';
import CheckIcon from '@/icons/CheckIcon';
import Button from '@/components/Button';
import CloseIcon from '@/icons/CloseIcon';
import {TFormValues, TNewEventFormProps} from './types';

const NewEventForm = ({setOpen}: TNewEventFormProps) => {
    const methods = useForm<TFormValues>({
        resolver: yupResolver(validation),
        defaultValues,
        mode: 'onSubmit',
    });

    const {
        register,
        handleSubmit,
        formState: {errors, isDirty},
    } = methods;

    const onSubmit: SubmitHandler<TFormValues> = newEvent => {
        setOpen(false);

        console.log(newEvent);

        // dispatch(
        //     addTask({
        //         id: uid(),
        //         title: newTask.taskTitle,
        //         columnId: columnId,
        //     }),
        // );
    };

    return (
        <div className="modal relative bg-mainBackgroundColor border border-sky-500 rounded-lg md:min-w-96 sm:min-w-56">
            <Button
                variant="primary"
                icon={<CloseIcon size="size-5" />}
                className="absolute right-2 top-2 p-1 text-sm cursor-pointer hover:text-sky-500"
                onClick={() => setOpen(false)}
            />

            <h3 className="text-lg font-bold p-3 text-center">Create new event</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col items-center justify-between gap-[20px] w-auto px-[30px] py-[20px]">
                    <div className="w-full flex flex-col gap-2">
                        <input
                            {...register('eventName')}
                            autoFocus
                            aria-invalid={errors.eventName ? 'true' : 'false'}
                            className="bg-black w-full focus:border-sky-500 border rounded outline-none px-[15px] py-[10px]"
                            placeholder="Enter event name"
                        />
                        {errors.eventName && (
                            <p role="alert" className="text-rose-500 text-xs pl-1">
                                {errors.eventName.message}
                            </p>
                        )}
                    </div>

                    <Button
                        variant="primary"
                        className={`${
                            isDirty && 'border-sky-500 text-sky-500'
                        } text-sm p-2 disabled:hover:border-secondaryBackgroundColor disabled:text-secondaryBackgroundColor disabled:hover:text-secondaryBackgroundColor disabled:cursor-auto`}
                        disabled={!isDirty}
                        text="Create event"
                        icon={<CheckIcon size="size-5" />}
                        type="submit"
                    />
                </div>
            </form>
        </div>
    );
};

export default NewEventForm;
