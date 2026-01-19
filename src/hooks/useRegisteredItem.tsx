import {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {addItemToOpen, removeItemFromOpen} from '@/redux/overflow/overflowSlice';
import {selectIsItemCurrentlyOpened} from '@/redux/overflow/selectors';
import {useAppDispatch} from '@/redux/store';

// TODO: investigate and optimize it
export const useRegisteredItem = ({refId, defaultIsOpen}: {refId: string; defaultIsOpen?: boolean}) => {
  const defaultIsOpenValue = defaultIsOpen ?? false;

  const dispatch = useAppDispatch();
  const isOpen = useSelector(selectIsItemCurrentlyOpened(refId));

  useEffect(() => {
    dispatch(addItemToOpen({id: refId, isOpen: defaultIsOpenValue}));

    return () => {
      dispatch(removeItemFromOpen(refId));
    };
  }, [dispatch, refId, defaultIsOpenValue]);

  return isOpen;
};
