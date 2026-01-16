import {PropsWithChildren, ReactElement} from 'react';

export type TooltipProps = PropsWithChildren<{
  triggerElement: ReactElement;
  className?: string;
  contentClassName?: string;
}>;
