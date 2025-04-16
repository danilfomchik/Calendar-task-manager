import {TOpeningItem} from './types';

export const toggleOverflowItem = (items: TOpeningItem[], payload: string, isOpen: boolean) => {
    return items.map(item => {
        if (item.id === payload) {
            return {
                ...item,
                isOpen,
            };
        }

        return item;
    });
};
