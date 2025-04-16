import {createPortal} from 'react-dom';

import {TModalProps} from './types';

const Modal = ({refItem, className, children}: TModalProps) => {
    return (
        <>
            {createPortal(
                <div
                    className={`modal-wrapper fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-secondaryBackgroundColor bg-opacity-80 ${className ? className : ''}`}>
                    <div ref={refItem}>{children}</div>
                </div>,
                document.body,
            )}
        </>
    );
};

export default Modal;
