import {ButtonVariants} from './types';

export const buttonVariants = {
    [ButtonVariants.primary]:
        'border-secondaryBackgroundColor bg-mainBackgroundColor hover:border-sky-500 hover:text-sky-500',
    [ButtonVariants.secondary]:
        'border-blue-600 bg-blue-600 hover:text-sky-500 hover:border-sky-500 hover:bg-mainBackgroundColor',
};
