import {useCallback, useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {uid} from 'uid';

import {addItemToOpen, onCloseItem, onOpenItem, removeItemFromOpen} from '@/redux/overflow/overflowSlice';
import {selectIsItemCurrentlyOpened} from '@/redux/overflow/selectors';
import {useAppDispatch} from '@/redux/store';

export const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | ''>('');

    const handleResize = useCallback(() => {
        if (window.innerWidth < 640) {
            setScreenSize('xs');
        } else if (window.innerWidth >= 640 && window.innerWidth < 768) {
            setScreenSize('sm');
        } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
            setScreenSize('md');
        } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
            setScreenSize('lg');
        } else if (window.innerWidth >= 1280 && window.innerWidth < 1536) {
            setScreenSize('xl');
        } else if (window.innerWidth >= 1536) {
            setScreenSize('2xl');
        }
    }, []);

    useEffect(() => {
        const observer = new ResizeObserver(handleResize);
        if (document.body) observer.observe(document.body);

        return () => observer.disconnect();
    }, [handleResize]);

    return screenSize;
};

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

export const useBodyClick = ({
    refId,
    isOpen,
    onClose,
}: {
    refId: string;
    isOpen: boolean;
    onClose: (refId: string) => void;
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const onBodyClick = useCallback(
        (event: MouseEvent) => {
            if (ref.current?.contains(event.target as Node)) {
                return;
            }

            if (isOpen) {
                onClose(refId);
            }
        },
        [onClose, refId, isOpen],
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            document.body.addEventListener('click', onBodyClick);
        }, 0);

        return () => {
            clearTimeout(timeout);
            document.body.removeEventListener('click', onBodyClick);
        };
    }, [onBodyClick]);

    return {ref};
};

export const useOpeningItem = () => {
    const dispatch = useAppDispatch();
    const refId = useRef<string>(uid()).current;
    const isOpen = useRegisteredItem({refId});

    const handleClose = useCallback(() => {
        dispatch(onCloseItem(refId));
    }, [dispatch, refId]);

    const {ref} = useBodyClick({refId, isOpen, onClose: handleClose});

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
