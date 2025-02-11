import {object, string} from 'yup';

export const defaultValues = {
    eventName: '',
};

export const validation = object().shape({
    eventName: string()
        .required('Name is required')
        .test('empty-check', 'Event name can not be empty string.', name => !!name.trim().length),
});
