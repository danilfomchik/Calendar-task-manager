import {createPortal} from 'react-dom';

import {IOnCloseModalEvent, TModalProps} from './types';

const Modal = ({className, onClose, children}: TModalProps) => {
    const onCloseModal = (e: IOnCloseModalEvent) => {
        if (e.target.classList.contains('modal-wrapper')) {
            if (onClose) {
                onClose();
            }
        }
    };
    return (
        <>
            {createPortal(
                <div className={`modal-wrapper ${className ? className : ''}`} onClick={onCloseModal}>
                    {children}
                </div>,
                document.body,
            )}
        </>
    );
};

export default Modal;
