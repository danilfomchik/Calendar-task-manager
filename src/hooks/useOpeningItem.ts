import {useCallback, useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {uid} from 'uid';

import {onCloseItem, onOpenItem} from '@/redux/overflow/overflowSlice';
import {selectOpenedItemsArray} from '@/redux/overflow/selectors';
import {useAppDispatch} from '@/redux/store';

export const useOpeningItem = (customRefId?: string) => {
  const dispatch = useAppDispatch();
  const currentlyOpenedItemsArray = useSelector(selectOpenedItemsArray);

  const ref = useRef<HTMLDivElement>(null);
  const refId = useRef<string>(customRefId || uid()).current;

  const isOpen = currentlyOpenedItemsArray.includes(refId);

  const handleClose = useCallback(
    ({passedRefId, onClose}: {passedRefId?: string; onClose?: () => void} = {}) => {
      dispatch(onCloseItem(passedRefId || refId));
      onClose?.();
    },
    [dispatch, refId],
  );

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

  useEffect(() => {
    // passing refId of the last opened item to close it by Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      const lastOpenedItemId = currentlyOpenedItemsArray[currentlyOpenedItemsArray.length - 1];

      if (e.key === 'Escape' && lastOpenedItemId === refId) {
        handleClose({passedRefId: lastOpenedItemId});
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose, currentlyOpenedItemsArray, refId]);

  return {
    ref,
    refId,
    isOpen,
    handleClose,
    handleOpen,
    handleToggle,
  };
};
