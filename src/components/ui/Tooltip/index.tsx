// import classNames from 'classnames';
// import {memo, useCallback, useRef, useState} from 'react';
// import {cx} from '@/services/utils';
// import {TooltipProps} from './types';
// // Tooltip component gets triggerElement as rendered element for hover
// // Tooltip component gets children as tooltip content
// const Tooltip = ({disabled, triggerElement, children, className = '', contentClassName = ''}: TooltipProps) => {
//   const [isOpened, setIsOpened] = useState(false);
//   const [isFitsContainer, setIsFitsContainer] = useState(true);
//   const tooltipRef = useRef<HTMLDivElement>(null);
//   // TODO: fix -> for every right day - fouc on close tooltip
// const onTooltipHover = useCallback(() => {
//   const containerSizes = document.documentElement.getBoundingClientRect();
//   const tooltipSizes = tooltipRef.current?.getBoundingClientRect();
//   if (!containerSizes || !tooltipSizes) return;
//   // 12 - right padding of the block
//   setIsFitsContainer(!(tooltipSizes.right > containerSizes.right - 12));
// }, []);
//   const handleHover = () => {
//     setIsOpened(prev => !prev);
//     onTooltipHover();
//   };
//   const handleMouseEnter = !disabled ? handleHover : undefined;
//   const handleMouseLeave = !disabled ? handleHover : undefined;
//   return (
//     <div className={classNames('relative', className)}>
//       {triggerElement(handleMouseEnter, handleMouseLeave)}
//       <div
//         ref={tooltipRef}
//         className={cx(
//           `max-w-[100px] max-h-[200px] overflow-auto absolute bottom-[calc(100%+6px)] transition-all duration-200 ease-in-out px-3 py-1 rounded-md border bg-black text-sm z-10 opacity-0 invisible`,
//           {
//             'right-[1px]': !isFitsContainer,
//             'left-0': isFitsContainer,
//           },
//           contentClassName,
//           {
//             'opacity-100 visible': isOpened,
//           },
//         )}>
//         {children}
//       </div>
//     </div>
//   );
// };
// export default memo(Tooltip);
import {
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
  PointerEvent as ReactPointerEvent,
  cloneElement,
  memo,
  useCallback,
  useId,
  useRef,
  useState,
} from 'react';

import {useTooltipTimers} from '@/hooks/useTooltipTimers';
import {cx} from '@/services/utils';

const TOOLTIP_DELAY_MS = 200;

export type TooltipProps = PropsWithChildren<{
  as?: 'span' | 'p' | 'div';
  disabled?: boolean;
  triggerElement: ReactElement;
  className?: string;
  contentClassName?: string;
  arrowClassName?: string;
}> &
  HTMLAttributes<HTMLDivElement>;

const Tooltip = ({
  as = 'div',
  disabled,
  triggerElement,
  children,
  className = '',
  contentClassName = '',
  arrowClassName = '',
  ...rest
}: TooltipProps) => {
  const [, setIsFitsContainer] = useState(true);

  const {isHovered, isOpened, open, close} = useTooltipTimers(TOOLTIP_DELAY_MS);
  const tooltipId = useId();
  const tooltipRef = useRef<HTMLDivElement>(null);

  const onTooltipHover = useCallback(() => {
    const containerSizes = document.documentElement.getBoundingClientRect();
    const tooltipSizes = tooltipRef.current?.getBoundingClientRect();
    if (!containerSizes || !tooltipSizes) return;
    // 12 - right padding of the block
    setIsFitsContainer(!(tooltipSizes.right > containerSizes.right - 12));
  }, []);

  const onEnter = (e: ReactPointerEvent<Element>) => {
    open(e);
    onTooltipHover();
  };

  const onLeave = (e: ReactPointerEvent<Element>) => {
    close(e);
    onTooltipHover();
  };

  const handlePointerEnter = !disabled ? onEnter : undefined;
  const handlePointerLeave = !disabled ? onLeave : undefined;

  const TooltipWrapper = as;

  // console.log('isFitsContainer-->', isFitsContainer);

  return (
    <TooltipWrapper
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={cx('relative cursor-default', className)}>
      {cloneElement(triggerElement as ReactElement<Record<string, unknown>>, {'aria-describedby': tooltipId})}

      {isHovered && (
        <div
          ref={tooltipRef}
          role="tooltip"
          id={tooltipId}
          className={cx(
            'flex flex-col items-center w-[250px] z-50',
            'absolute left-1/2 top-0 -translate-x-1/2 bottom-full pb-0.5',
            'transition-all duration-200 ease-in-out',
            'opacity-0 invisible',
            contentClassName,
            {
              'opacity-100 visible': isOpened,
            },
          )}
          {...rest}>
          {children}
          <svg
            className={arrowClassName}
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="5"
            viewBox="0 0 28 14"
            fill="none">
            <path
              d="M28 0L15.4142 12.5858C14.6332 13.3668 13.3668 13.3668 12.5858 12.5858L0 0H28Z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}
    </TooltipWrapper>
  );
};

export default memo(Tooltip);
