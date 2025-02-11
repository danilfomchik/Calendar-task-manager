import {Dispatch} from 'react';

export type TNewEventByDateFormProps = {
    setOpen: Dispatch<React.SetStateAction<boolean>>;
};

export type TFormValues = {
    eventName: string;
    eventYear?: string;
    eventMonth?: string;
    eventDay?: string;
};
