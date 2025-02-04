import {object, string} from 'yup';

export const defaultValues = {
    taskTitle: '',
};

export const validation = object().shape({
    taskTitle: string().required('Task name is required'),
});
