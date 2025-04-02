import {useCallback, useEffect, useRef, useState} from 'react';

import {decreaseOpenedItems, increaseOpenedItems} from '@/redux/overflow/overflowSlice';
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

export const useBodyClick = (onClose: () => void) => {
    const ref = useRef<HTMLDivElement>(null);

    const onBodyClick = useCallback(
        (event: MouseEvent) => {
            if (ref.current?.contains(event.target as Node)) {
                return;
            }

            onClose();
        },
        [onClose],
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

export const useOpen = (initialValue: boolean) => {
    const [isOpen, setIsOpen] = useState(initialValue);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleOpen = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleToggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    return {
        isOpen,
        handleClose,
        handleOpen,
        handleToggle,
    };
};

export const useModal = () => {
    const {isOpen, handleClose, handleOpen} = useOpen(false);

    const dispatch = useAppDispatch();

    const handleModalClose = useCallback(() => {
        handleClose();
        dispatch(decreaseOpenedItems());
    }, [handleClose, dispatch]);

    const handleModalOpen = useCallback(() => {
        handleOpen();
        dispatch(increaseOpenedItems());
    }, [handleOpen, dispatch]);

    return {
        isOpen,
        handleModalClose,
        handleModalOpen,
    };
};
