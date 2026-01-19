import {useCallback, useRef} from 'react';
import {uid} from 'uid';

import {useRegisteredItem} from '@/hooks/useRegisteredItem';
import {onCloseItem, onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';

import {useBodyClick} from './useBodyClick';

export const useOpeningItem = () => {
  const dispatch = useAppDispatch();
  const refId = useRef<string>(uid()).current;
  const isOpen = useRegisteredItem({refId});

  const handleClose = useCallback(() => {
    dispatch(onCloseItem(refId));
  }, [dispatch, refId]);

  const {ref} = useBodyClick({refId, isOpen, onClick: handleClose});

  const handleOpen = useCallback(() => {
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
