import {yupResolver} from '@hookform/resolvers/yup';
import cn from 'classnames';
import {useCallback} from 'react';
import {FormProvider, useForm} from 'react-hook-form';

import Button from '@/components/Button';
import InputControl from '@/components/formInputs/InputControl';
import TextareaControl from '@/components/formInputs/TextareaControl';
import CheckIcon from '@/icons/CheckIcon';
import CloseIcon from '@/icons/CloseIcon';
import EditIcon from '@/icons/EditIcon';
import {addEvent} from '@/redux/events/eventsSlice';
import {useAppDispatch} from '@/redux/store';
import {createEvent} from '@/services/utils';

import {validation} from './form';
import {TBoardEventFormProps, TFormFields} from './types';

const BoardEventForm = ({
  actionType = 'edit',
  formTitle,
  defaultValues = {
    eventName: '',
    eventDescription: '',
  },
  date,
  handleModalClose,
}: TBoardEventFormProps) => {
  const dispatch = useAppDispatch();
  const methods = useForm({
    resolver: yupResolver(validation),
    defaultValues,
    mode: 'onSubmit',
  });

  const {
    control,
    handleSubmit,
    formState: {errors, isDirty},
  } = methods;

  const onSubmit = useCallback(
    ({eventName, eventDescription}: TFormFields) => {
      handleModalClose();

      if (actionType === 'edit') {
        // eslint-disable-next-line no-console
        console.log('edit', eventName);
      } else {
        const newEvent = createEvent({
          eventName,
          date,
          description: eventDescription || '',
        });

        dispatch(addEvent(newEvent));
      }
    },
    [actionType, date, dispatch, handleModalClose],
  );

  return (
    <div>
      <Button
        startIcon={<CloseIcon size="size-5" />}
        className="absolute right-2 top-2 p-1 text-sm cursor-pointer hover:text-sky-500"
        onClick={handleModalClose}
      />

      <h3 className="text-lg font-bold p-3 text-center">{formTitle}</h3>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center justify-between gap-[20px] w-auto px-[30px] py-[20px]">
            <div className="flex flex-col gap-3 w-full">
              <InputControl autoFocus control={control} name="eventName" placeholder="Enter required name" />
              <TextareaControl control={control} name="eventDescription" placeholder="Enter optional description" />
            </div>

            <Button
              className={cn(
                {
                  'border-sky-500 text-sky-500': isDirty && !errors.eventName,
                },
                'text-sm p-2',
              )}
              disabled={!isDirty || !!errors.eventName}
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

export default BoardEventForm;
