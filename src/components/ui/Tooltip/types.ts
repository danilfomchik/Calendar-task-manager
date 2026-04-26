import {PropsWithChildren, ReactElement, RefObject} from 'react';

export type TooltipProps = PropsWithChildren<{
  disabled?: boolean;
  triggerElement: ReactElement;
  className?: string;
  contentClassName?: string;
  onHover?: (isOpened: boolean, tooltipRef: RefObject<HTMLDivElement>) => void;
}>;
