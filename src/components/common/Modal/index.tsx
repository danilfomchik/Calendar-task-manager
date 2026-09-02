import classNames from 'classnames';
import {createPortal} from 'react-dom';

import {TModalProps} from './types';

const Modal = ({refItem, className, children, onClose}: TModalProps) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (refItem?.current?.contains(e.target as Node)) {
      return;
    }

    onClose();
  };

  return (
    <>
      {createPortal(
        <div
          onClick={handleClose}
          className={classNames(
            'fixed inset-0 flex items-center justify-center bg-overlay bg-opacity-80 z-1000',
            className,
          )}>
          <div
            ref={refItem}
            className="absolute max-sm:bottom-0 max-sm:left-0 max-sm:right-0 sm:relative bg-mainBackgroundColor border-t sm:border rounded-t-lg sm:rounded-lg md:min-w-96 sm:min-w-56">
            {children}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default Modal;
