import {PropsWithChildren, RefObject} from 'react';

export type TModalProps = PropsWithChildren<{
    refItem: RefObject<HTMLDivElement>;
    onClose: (refId: string) => void;
    className?: string;
}>;
