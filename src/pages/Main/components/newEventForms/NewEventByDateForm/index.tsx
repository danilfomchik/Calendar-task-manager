import {useEffect, useMemo} from 'react';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';

import {validation} from './form';
import CheckIcon from '@/icons/CheckIcon';
import Button from '@/components/Button';
import CloseIcon from '@/icons/CloseIcon';
import {TFormValues, TNewEventByDateFormProps} from './types';
import Dropdown from '@/components/Dropdown';
import {selectDay, selectMonth, selectYear} from '@/redux/date/selectors';
import {formatDate} from '@/services/utils';

const NewEventByDateForm = ({setOpen}: TNewEventByDateFormProps) => {
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
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {errors, isDirty},
    } = methods;

    const formYearValue = watch('eventYear');
    const formMonthValue = watch('eventMonth');
    const formDayValue = watch('eventDay');

    const yearsOptions = useMemo(() => {
        const currentYear = moment().year();
        const startYear = currentYear - 10; // Adjust the range as needed
        return Array.from({length: 30}, (_, i) => (startYear + i).toString());
    }, []);
    const monthsOptions = useMemo(() => moment.months(), []);
    const daysOptions = useMemo(() => {
        const month = formatDate(moment().month(formMonthValue!), 'M');
        const year = formYearValue ? formYearValue : '';

        const amountOfDays = moment([year, +month - 1]).daysInMonth();

        return Array.from({length: amountOfDays}, (_, i) => (i + 1).toString());
    }, [formMonthValue, formYearValue]);

    const onMonthChange = (newMonth: string) => {
        setValue('eventMonth', newMonth);
    };

    const onYearChange = (newYear: string) => {
        setValue('eventYear', newYear);
    };

    const onDayChange = (newDay: string) => {
        setValue('eventDay', newDay);
    };

    const onSubmit: SubmitHandler<TFormValues> = newEvent => {
        setOpen(false);

        // TODO: trim eventName value
        console.log(newEvent);
    };

    useEffect(() => {
        register('eventMonth');
        register('eventYear');
        register('eventDay');
    }, [month, register]);

    return (
        <div className="modal relative bg-mainBackgroundColor border border-sky-500 rounded-lg min-w-48 md:min-w-96 sm:min-w-56">
            <Button
                variant="primary"
                icon={<CloseIcon size="size-5" />}
                className="absolute right-2 top-2 p-1 text-sm cursor-pointer hover:text-sky-500"
                onClick={() => setOpen(false)}
            />

            <h3 className="text-lg font-bold p-3 text-center">Create new event</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col items-center justify-between gap-[20px] w-auto px-[30px] py-[20px]">
                    <div className="flex gap-2 relative self-stretch max-md:flex-col">
                        <Dropdown
                            selectedOption={formMonthValue}
                            changeSelectedOption={onMonthChange}
                            options={monthsOptions}
                            placeholder="Pick month"
                            className="md:flex-1"
                        />
                        <Dropdown
                            selectedOption={formYearValue}
                            changeSelectedOption={onYearChange}
                            options={yearsOptions}
                            placeholder="Pick year"
                            className="md:flex-1"
                        />
                        <Dropdown
                            selectedOption={formDayValue}
                            changeSelectedOption={onDayChange}
                            options={daysOptions}
                            placeholder="Pick day"
                            className="md:flex-1"
                        />
                    </div>

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
                        className={`${isDirty && 'border-sky-500 text-sky-500'} text-sm p-2`}
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

export default NewEventByDateForm;
