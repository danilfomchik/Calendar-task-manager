import {yupResolver} from '@hookform/resolvers/yup';
import {useMemo} from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {useSelector} from 'react-redux';

import Button from '@/components/Button';
import DropdownControl from '@/components/formInputs/DropdownControl';
import InputControl from '@/components/formInputs/InputControl';
import CheckIcon from '@/icons/CheckIcon';
import CloseIcon from '@/icons/CloseIcon';
import {selectDay, selectMonth, selectYear} from '@/redux/date/selectors';
import {getDays, getMonthsOptions, getYearsOptions} from '@/services/utils';

import {validation} from './form';
import {TFormValues, TNewEventByDateFormProps} from './types';

const NewEventByDateForm = ({handleModalClose}: TNewEventByDateFormProps) => {
    const year = useSelector(selectYear);
    const month = useSelector(selectMonth);
    const day = useSelector(selectDay);

    const methods = useForm<TFormValues>({
        resolver: yupResolver(validation),
        defaultValues: {
            eventName: '',
            eventYear: year || '',
            eventMonth: month || '',
            eventDay: day || '',
        },
        mode: 'onSubmit',
        shouldUnregister: false,
    });

    const {
        control,
        handleSubmit,
        watch,
        formState: {isDirty},
    } = methods;

    const formYearValue = watch('eventYear');
    const formMonthValue = watch('eventMonth');

    const yearsOptions = useMemo(() => getYearsOptions(), []);
    const monthsOptions = useMemo(() => getMonthsOptions(), []);
    const daysOptions = useMemo(
        () => getDays(formYearValue || '', formMonthValue || ''),
        [formYearValue, formMonthValue],
    );

    const onSubmit: SubmitHandler<TFormValues> = newEvent => {
        handleModalClose();

        // TODO: trim eventName value
        // eslint-disable-next-line no-console
        console.log(newEvent);
    };

    return (
        <div className="modal relative bg-mainBackgroundColor border border-sky-500 rounded-lg min-w-48 md:min-w-96 sm:min-w-56">
            <Button
                startIcon={<CloseIcon size="size-5" />}
                className="absolute right-2 top-2 p-1 text-sm cursor-pointer hover:text-sky-500"
                onClick={handleModalClose}
            />

            <h3 className="text-lg font-bold p-3 text-center">Create new event</h3>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col items-center justify-between gap-[20px] w-auto px-[30px] py-[20px]">
                        <div className="flex gap-2 relative self-stretch max-md:flex-col">
                            <DropdownControl control={control} options={monthsOptions} name="eventMonth" />
                            <DropdownControl control={control} options={yearsOptions} name="eventYear" />
                            <DropdownControl control={control} options={daysOptions} name="eventDay" />
                        </div>

                        <div className="w-full flex flex-col gap-2">
                            <InputControl autoFocus control={control} name="eventName" />
                        </div>

                        <Button
                            className={`${isDirty && 'border-sky-500 text-sky-500'} text-sm p-2`}
                            disabled={!isDirty}
                            text="Create event"
                            startIcon={<CheckIcon size="size-5" />}
                            type="submit"
                        />
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default NewEventByDateForm;
