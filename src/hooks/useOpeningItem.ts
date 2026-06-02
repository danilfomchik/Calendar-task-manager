import {useCallback, useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {uid} from 'uid';

import {onCloseItem, onOpenItem} from '@/redux/overflow/overflowSlice';
import {selectOpenedItemsArray} from '@/redux/overflow/selectors';
import {useAppDispatch} from '@/redux/store';

export const useOpeningItem = () => {
  const dispatch = useAppDispatch();
  const currentlyOpenedItemsArray = useSelector(selectOpenedItemsArray);

  const ref = useRef<HTMLDivElement>(null);
  const refId = useRef<string>(uid()).current;

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(
    (passedRefId?: string) => {
      setIsOpen(false);
      dispatch(onCloseItem(passedRefId || refId));
    },
    [dispatch, refId],
  );

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

  useEffect(() => {
    // passing refId of the last opened item to close it by Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      const lastOpenedItemId = currentlyOpenedItemsArray[currentlyOpenedItemsArray.length - 1];

      if (e.key === 'Escape' && lastOpenedItemId === refId) {
        handleClose(lastOpenedItemId);
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
