export type TOpeningItem = {
    id: string;
    isOpen: boolean;
};

export type TOverflowState = {
    currentlyOpened: string[];
    itemsToOpen: TOpeningItem[];
};
