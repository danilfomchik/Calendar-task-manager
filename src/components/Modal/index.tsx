import {createPortal} from 'react-dom';

import {useRegisteredItem} from '@/services/hooks';

import {TModalProps} from './types';

const Modal = ({refId, refItem, className, children}: TModalProps) => {
    const isOpen = useRegisteredItem({refId});

    return (
        <>
            {isOpen
                ? createPortal(
                      <div
                          className={`modal-wrapper fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-secondaryBackgroundColor bg-opacity-80 ${className ? className : ''}`}>
                          <div ref={refItem}>{children}</div>
                      </div>,
                      document.body,
                  )
                : null}
        </>
    );
};

export default Modal;
