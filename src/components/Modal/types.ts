import {MouseEvent, PropsWithChildren} from 'react';

export interface IOnCloseModalEvent extends MouseEvent<HTMLDivElement> {
    target: EventTarget & HTMLDivElement;
}

export type TModalProps = PropsWithChildren<{
    onClose?: () => void;
    className?: string;
}>;
