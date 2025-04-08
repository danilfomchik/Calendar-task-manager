type TItemTOOpen = {
    id: string;
    isOpen: boolean;
};

export type TOverflowState = {
    currentlyOpened: string[];
    itemsToOpen: TItemTOOpen[];
};
