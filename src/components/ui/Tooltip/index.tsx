import classNames from 'classnames';
import {cloneElement, memo, useEffect, useRef, useState} from 'react';

import {TooltipProps} from './types';

// Tooltip component gets triggerElement as rendered element for hover
// Tooltip component gets children as tooltip content
const Tooltip = ({
  disabled,
  triggerElement,
  children,
  className = '',
  contentClassName = '',
  onHover,
}: TooltipProps) => {
  const [isOpened, setIsOpened] = useState(false);

  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => setIsOpened(true);
  const handleMouseLeave = () => setIsOpened(false);

  useEffect(() => {
    if (disabled) return;

    onHover?.(isOpened, tooltipRef);
  }, [disabled, isOpened, onHover]);

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
    <div className={classNames('relative', className)}>
      {triggerWithHandlers}

      {isOpened && (
        <div
          ref={tooltipRef}
          className={classNames(
            `max-w-[100px] max-h-[200px] overflow-auto absolute bottom-[calc(100%+6px)] transition-all duration-200 ease-in-out px-3 py-1 rounded-md border bg-black text-sm z-10 opacity-100`,
            contentClassName,
          )}>
          {children}
        </div>
      )}
    </div>
  );
};

export default memo(Tooltip);
