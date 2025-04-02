import {PropsWithChildren} from 'react';

export type TModalProps = PropsWithChildren<{
    onClose: () => void;
    className?: string;
}>;
