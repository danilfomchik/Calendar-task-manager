export type TEventsTotalProps = {
  count: number;
  className?: string;
  // shown instead of "0 events" on an empty day (Home: "Free day"); the Day page leaves it unset
  emptyLabel?: string;
};
