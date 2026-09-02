import {RefObject, useCallback, useState} from 'react';

import {useCalendarContext} from './useCalendarContext';

export const useEventTooltip = () => {
  const [isFitsContainer, setIsFitsContainer] = useState(true);
  const containerRef = useCalendarContext();

  const onTooltipHover = useCallback(
    (isOpened: boolean, tooltipRef: RefObject<HTMLDivElement>) => {
      if (isOpened) {
        const containerSizes = containerRef.current?.getBoundingClientRect();
        const tooltipSizes = tooltipRef.current?.getBoundingClientRect();

        if (!containerSizes || !tooltipSizes) return;

        // 12 - right padding of the block
        if (tooltipSizes.right > containerSizes.right - 12) {
          setIsFitsContainer(false);
        }
      }
    },
    [containerRef],
  );

  return {
    isFitsContainer,
    onTooltipHover,
  };
};
