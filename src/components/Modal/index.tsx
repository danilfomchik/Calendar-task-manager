import {createPortal} from 'react-dom';

import {useBodyClick} from '@/services/hooks';

import {TModalProps} from './types';

const Modal = ({className, onClose, children}: TModalProps) => {
    const {ref} = useBodyClick(onClose);

    return (
        <>
            {createPortal(
                <div
                    className={`modal-wrapper fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-secondaryBackgroundColor bg-opacity-80 ${className ? className : ''}`}>
                    <div ref={ref}>{children}</div>
                </div>,
                document.body,
            )}
        </>
    );
};

export default Modal;
