import {PropsWithChildren, ReactNode} from 'react';

export type TBlockCardProps = PropsWithChildren<{
  // accessible name of the block (also its region label)
  label: string;
  // the visible header row (block name, extra controls)
  header: ReactNode;
  busy?: boolean;
  // surface, border and min height; skeleton and content of a block share it so the blocks below don't jump
  className: string;
}>;

export type TSkeletonLineProps = {className: string};
