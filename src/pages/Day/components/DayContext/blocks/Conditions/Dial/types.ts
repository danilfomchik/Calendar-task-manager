import {PropsWithChildren, ReactNode} from 'react';

export type TDialProps = PropsWithChildren<{
  // 0-100, fills the ring; null leaves it empty (days with only recorded rainfall have no forecast chance)
  rainChance: number | null;
  // degrees the wind comes from; null hides the pointer
  windDirection: number | null;
  // what fills the round face, e.g. the Sky scene
  face: ReactNode;
}>;
