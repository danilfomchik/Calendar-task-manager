import {object, string} from 'yup';

export const defaultValues = {
  eventName: '',
  eventDescription: '',
};

export const validation = object().shape({
  eventName: string()
    .required('This field is required')
    .test('empty-check', 'Event name can not be empty string.', name => !!name.trim().length),
  eventDescription: string(),
});
