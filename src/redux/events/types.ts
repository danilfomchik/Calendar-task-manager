export type TId = string;

export type TEvent = {
    id: TId;
    title: string;
    description?: string;
    date: string;
    color: string;
};

export type TEventsState = {
    events: {
        [key: string]: TEvent[];
    } | null;
};
