export type TMoonDiscProps = {
  // 0 new moon, 0.25 first quarter, 0.5 full moon, 0.75 last quarter
  fraction: number;
  // the Southern Hemisphere sees the lit side the other way round
  isSouthern: boolean;
};
