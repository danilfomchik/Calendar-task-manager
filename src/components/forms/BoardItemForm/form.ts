import {object, string} from 'yup';

export const defaultValues = {
    field: '',
};

export const validation = object().shape({
    field: string()
        .required('This field is required')
        .test('empty-check', 'Event name can not be empty string.', name => !!name.trim().length),
});
