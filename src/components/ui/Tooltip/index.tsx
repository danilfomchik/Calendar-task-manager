import cn from 'classnames';
import {cloneElement, memo, useCallback, useEffect, useRef, useState} from 'react';

import {useCalendarContext} from '@/hooks/useCalendarContext';

import {TooltipProps} from './types';

// Tooltip component gets triggerElement as rendered element for hover
// Tooltip component gets children as tooltip content
const Tooltip = ({disabled, triggerElement, children, className = '', contentClassName = ''}: TooltipProps) => {
  const [isFitsContainer, setIsFitsContainer] = useState(true);
  const [isOpened, setIsOpened] = useState(false);

  const containerRef = useCalendarContext();
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => setIsOpened(true);
  const handleMouseLeave = () => setIsOpened(false);

  const onTooltipHover = useCallback(() => {
    if (isOpened) {
      const containerSizes = containerRef.current?.getBoundingClientRect();
      const tooltipSizes = tooltipRef.current?.getBoundingClientRect();

      if (!containerSizes || !tooltipSizes) return;

      // 12 - right padding of the block
      if (tooltipSizes.right > containerSizes.right - 12) {
        setIsFitsContainer(false);
      }
    }
  }, [containerRef, isOpened]);

  useEffect(() => {
    if (disabled) return;

    onTooltipHover();
  }, [disabled, onTooltipHover]);

  // clone trigger element and add mouse events
  const triggerWithHandlers = cloneElement(triggerElement, {
    onMouseEnter: (e: MouseEvent) => {
      if (disabled) return;

      triggerElement.props.onMouseEnter?.(e);
      handleMouseEnter();
    },
    onMouseLeave: (e: MouseEvent) => {
      if (disabled) return;

      triggerElement.props.onMouseLeave?.(e);
      handleMouseLeave();
    },
  });

  return (
    <div className={cn('relative', className)}>
      {triggerWithHandlers}

      {isOpened && (
        <div
          ref={tooltipRef}
          className={cn(
            `max-w-[100px] max-h-[200px] overflow-auto absolute bottom-[calc(100%+6px)] transition-all duration-200 ease-in-out px-3 py-1 rounded-md border bg-black text-sm z-10 opacity-100`,
            {
              'right-[1px]': !isFitsContainer,
              'left-0': isFitsContainer,
            },
            contentClassName,
          )}>
          {children}
        </div>
      )}
    </div>
  );
};

export default memo(Tooltip);
