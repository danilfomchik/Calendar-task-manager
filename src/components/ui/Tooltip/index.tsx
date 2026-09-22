import classNames from 'classnames';
import {memo, useCallback, useRef, useState} from 'react';

import {cx} from '@/services/utils';

import {TooltipProps} from './types';

// Tooltip component gets triggerElement as rendered element for hover
// Tooltip component gets children as tooltip content
const Tooltip = ({disabled, triggerElement, children, className = '', contentClassName = ''}: TooltipProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isFitsContainer, setIsFitsContainer] = useState(true);
  const tooltipRef = useRef<HTMLDivElement>(null);
  // TODO: fix -> for every right day - fouc on close tooltip
  const onTooltipHover = useCallback(() => {
    const containerSizes = document.documentElement.getBoundingClientRect();
    const tooltipSizes = tooltipRef.current?.getBoundingClientRect();
    if (!containerSizes || !tooltipSizes) return;
    // 12 - right padding of the block
    setIsFitsContainer(!(tooltipSizes.right > containerSizes.right - 12));
  }, []);
  const handleHover = () => {
    setIsOpened(prev => !prev);
    onTooltipHover();
  };
  const handleMouseEnter = !disabled ? handleHover : undefined;
  const handleMouseLeave = !disabled ? handleHover : undefined;
  return (
    <div className={classNames('relative', className)}>
      {triggerElement(handleMouseEnter, handleMouseLeave)}
      <div
        ref={tooltipRef}
        className={cx(
          `max-w-[100px] max-h-[200px] overflow-auto absolute bottom-[calc(100%+6px)] transition-all duration-200 ease-in-out px-3 py-1 rounded-md border bg-black text-sm z-10 opacity-0 invisible`,
          {
            'right-[1px]': !isFitsContainer,
            'left-0': isFitsContainer,
          },
          contentClassName,
          {
            'opacity-100 visible': isOpened,
          },
        )}>
        {children}
      </div>
    </div>
  );
};
export default memo(Tooltip);
