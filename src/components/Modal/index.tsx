import {useEffect} from 'react';
import {createPortal} from 'react-dom';

import {IOnCloseModalEvent, TModalProps} from './types';

const Modal = ({onClose, children}: TModalProps) => {
    const onCloseModal = (e: IOnCloseModalEvent) => {
        if (e.target.classList.contains('modal-wrapper')) {
            if (onClose) {
                onClose();
            }
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <>
            {createPortal(
                <div
                    className={
                        'modal-wrapper fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-secondaryBackgroundColor bg-opacity-80'
                    }
                    onClick={onCloseModal}>
                    {children}
                </div>,
                document.body,
            )}
        </>
    );
};

export default Modal;
