import {PropsWithChildren, ReactElement} from 'react';

export type TooltipProps = PropsWithChildren<{
  disabled?: boolean;
  triggerElement: ReactElement;
  className?: string;
  contentClassName?: string;
}>;
