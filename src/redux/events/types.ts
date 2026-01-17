export type TId = string;

export type TEvent = {
  id: TId;
  title: string;
  description?: string;
  date: string;
  color: string;
};

export type TEventsState = {
  eventsById: {
    [key: string]: TEvent;
  };
  eventsByDate: {
    [key: string]: string[] | undefined;
  };
};
