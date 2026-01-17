import cn from 'classnames';
import {createPortal} from 'react-dom';

import {TModalProps} from './types';

const Modal = ({refItem, className, children}: TModalProps) => {
  return (
    <>
      {createPortal(
        <div
          className={cn(
            'fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-secondaryBackgroundColor bg-opacity-80 z-20',
            className,
          )}>
          <div
            ref={refItem}
            className='relative bg-mainBackgroundColor border border-sky-500 rounded-lg md:min-w-96 sm:min-w-56"'>
            {children}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default Modal;
