import {useCallback, useRef, useState} from 'react';
import {uid} from 'uid';

import {onCloseItem, onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';

export const useOpeningItem = () => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const refId = useRef<string>(uid()).current;

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);

    dispatch(onCloseItem(refId));
  }, [dispatch, refId]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);

    dispatch(onOpenItem(refId));
  }, [dispatch, refId]);

  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [handleOpen, handleClose, isOpen]);

  return {
    ref,
    refId,
    isOpen,
    handleClose,
    handleOpen,
    handleToggle,
  };
};
