import {PropsWithChildren, RefObject} from 'react';

export type TModalProps = PropsWithChildren<{
    refId: string;
    refItem: RefObject<HTMLDivElement>;
    onClose: (refId: string) => void;
    className?: string;
}>;
