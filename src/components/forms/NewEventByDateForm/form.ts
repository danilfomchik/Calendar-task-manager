import {object, string} from 'yup';

export const validation = object().shape({
    eventName: string()
        .required('Name is required')
        .test('empty-check', 'Event name can not be empty string.', name => !!name.trim().length),
    eventYear: string().required(),
    eventMonth: string().required(),
    eventDay: string().required(),
    eventDescription: string(),
});
