import {PropsWithChildren, ReactElement} from 'react';

export type TooltipProps = PropsWithChildren<{
  disabled?: boolean;
  triggerElement: (onMouseEnter?: () => void, onMouseLeave?: () => void) => ReactElement;
  className?: string;
  contentClassName?: string;
}>;
