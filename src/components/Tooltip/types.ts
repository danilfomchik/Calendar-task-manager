import {PropsWithChildren, ReactElement} from 'react';

export type TooltipProps = PropsWithChildren<{
    triggerElement: ReactElement;
    triggerElementClassName?: string;
    tooltipClassnames?: string;
}>;
