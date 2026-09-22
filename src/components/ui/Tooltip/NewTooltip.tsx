import {
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
  PointerEvent as ReactPointerEvent,
  cloneElement,
  memo,
  useId,
  useLayoutEffect,
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
  defaultPosition?: TooltipPositions;
}> &
  HTMLAttributes<HTMLDivElement>;

enum TooltipPositions {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT_TOP = 'right-top',
  LEFT_TOP = 'left-top',
  RIGHT_BOTTOM = 'right-bottom',
  LEFT_BOTTOM = 'left-bottom',
}

const POSITIONS_MAP = {
  [TooltipPositions.TOP]: 'absolute bottom-full left-1/2 -translate-x-1/2',
  [TooltipPositions.RIGHT]: 'absolute left-full bottom-1/2 translate-y-1/2',
  [TooltipPositions.BOTTOM]: 'absolute top-full left-1/2 -translate-x-1/2',
  [TooltipPositions.LEFT]: 'absolute right-full bottom-1/2 translate-y-1/2',

  [TooltipPositions.RIGHT_TOP]: 'absolute left-full bottom-full',
  [TooltipPositions.LEFT_TOP]: 'absolute right-full bottom-full',
  [TooltipPositions.RIGHT_BOTTOM]: 'absolute left-full top-full',
  [TooltipPositions.LEFT_BOTTOM]: 'absolute right-full top-full',
};

// TODO: investigate implementation
const getExpectedRect = (preferredPosition: TooltipPositions, anchor: DOMRect, tooltip: DOMRect) => {
  const centerX = anchor.left + anchor.width / 2 - tooltip.width / 2;
  const centerY = anchor.top + anchor.height / 2 - tooltip.height / 2;

  switch (preferredPosition) {
    case TooltipPositions.TOP:
      // absolute bottom-full left-1/2 -translate-x-1/2
      return {left: centerX, right: centerX + tooltip.width, top: anchor.top - tooltip.height, bottom: anchor.top};

    case TooltipPositions.BOTTOM:
      // absolute top-full left-1/2 -translate-x-1/2
      return {
        left: centerX,
        right: centerX + tooltip.width,
        top: anchor.bottom,
        bottom: anchor.bottom + tooltip.height,
      };

    case TooltipPositions.RIGHT:
      // absolute left-full bottom-1/2 translate-y-1/2
      return {left: anchor.right, right: anchor.right + tooltip.width, top: centerY, bottom: centerY + tooltip.height};

    case TooltipPositions.LEFT:
      // absolute right-full bottom-1/2 translate-y-1/2
      return {left: anchor.left - tooltip.width, right: anchor.left, top: centerY, bottom: centerY + tooltip.height};

    case TooltipPositions.RIGHT_TOP:
      // absolute left-full bottom-full — ліва межа = права межа anchor, нижня межа = верхня межа anchor
      return {
        left: anchor.right,
        right: anchor.right + tooltip.width,
        top: anchor.top - tooltip.height,
        bottom: anchor.top,
      };

    case TooltipPositions.LEFT_TOP:
      // absolute right-full bottom-full — права межа = ліва межа anchor, нижня межа = верхня межа anchor
      return {
        left: anchor.left - tooltip.width,
        right: anchor.left,
        top: anchor.top - tooltip.height,
        bottom: anchor.top,
      };

    case TooltipPositions.RIGHT_BOTTOM:
      // absolute left-full top-full — ліва межа = права межа anchor, верхня межа = нижня межа anchor
      return {
        left: anchor.right,
        right: anchor.right + tooltip.width,
        top: anchor.bottom,
        bottom: anchor.bottom + tooltip.height,
      };

    case TooltipPositions.LEFT_BOTTOM:
      // absolute right-full top-full — права межа = ліва межа anchor, верхня межа = нижня межа anchor
      return {
        left: anchor.left - tooltip.width,
        right: anchor.left,
        top: anchor.bottom,
        bottom: anchor.bottom + tooltip.height,
      };

    default:
      return {left: centerX, right: centerX + tooltip.width, top: centerY, bottom: centerY + tooltip.height};
  }
};

type H = 'left' | 'right' | 'center';
type V = 'top' | 'bottom' | 'center';

const AXES: Record<TooltipPositions, {h: H; v: V}> = {
  [TooltipPositions.TOP]: {h: 'center', v: 'top'},
  [TooltipPositions.BOTTOM]: {h: 'center', v: 'bottom'},
  [TooltipPositions.RIGHT]: {h: 'right', v: 'center'},
  [TooltipPositions.LEFT]: {h: 'left', v: 'center'},
  [TooltipPositions.RIGHT_TOP]: {h: 'right', v: 'top'},
  [TooltipPositions.LEFT_TOP]: {h: 'left', v: 'top'},
  [TooltipPositions.RIGHT_BOTTOM]: {h: 'right', v: 'bottom'},
  [TooltipPositions.LEFT_BOTTOM]: {h: 'left', v: 'bottom'},
};

const AXES_TO_POSITION: Record<string, TooltipPositions> = {
  'center-top': TooltipPositions.TOP,
  'center-bottom': TooltipPositions.BOTTOM,
  'right-center': TooltipPositions.RIGHT,
  'left-center': TooltipPositions.LEFT,
  'right-top': TooltipPositions.RIGHT_TOP,
  'left-top': TooltipPositions.LEFT_TOP,
  'right-bottom': TooltipPositions.RIGHT_BOTTOM,
  'left-bottom': TooltipPositions.LEFT_BOTTOM,
};

const getTooltipPosition = (
  preferredPosition: TooltipPositions,
  anchorRect: DOMRect,
  tooltipRect: DOMRect,
  viewport: DOMRect,
): TooltipPositions => {
  const expected = getExpectedRect(preferredPosition, anchorRect, tooltipRect);
  const {h: originalH, v: originalV} = AXES[preferredPosition];

  const overflowsRight = expected.right > viewport.right;
  const overflowsLeft = expected.left < viewport.left;
  const overflowsTop = expected.top < viewport.top;
  const overflowsBottom = expected.bottom > viewport.bottom;

  // за замовчуванням зберігаємо ОРИГІНАЛЬНУ вісь — не центровану
  let h: H = originalH;
  let v: V = originalV;

  if (overflowsRight && !overflowsLeft) h = TooltipPositions.LEFT;
  else if (overflowsLeft && !overflowsRight) h = TooltipPositions.RIGHT;

  if (overflowsBottom && !overflowsTop) v = TooltipPositions.TOP;
  else if (overflowsTop && !overflowsBottom) v = TooltipPositions.BOTTOM;

  const key = `${h}-${v}`;
  return AXES_TO_POSITION[key] ?? preferredPosition;
};

const NewTooltip = ({
  as = 'div',
  disabled,
  triggerElement,
  children,
  className = '',
  contentClassName = '',
  arrowClassName = '',
  defaultPosition = TooltipPositions.RIGHT,
  ...rest
}: TooltipProps) => {
  const [position, setPosition] = useState<TooltipPositions>(defaultPosition);

  const {isHovered, isOpened, open, close} = useTooltipTimers(TOOLTIP_DELAY_MS);
  const tooltipId = useId();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onEnter = (e: ReactPointerEvent<Element>) => {
    open(e);
  };

  const onLeave = (e: ReactPointerEvent<Element>) => {
    close(e);
  };

  const handlePointerEnter = !disabled ? onEnter : undefined;
  const handlePointerLeave = !disabled ? onLeave : undefined;

  const TooltipWrapperElement = as;

  useLayoutEffect(() => {
    if (!isHovered) {
      setPosition(defaultPosition);
      return;
    }

    const containerSizes = {
      top: 0,
      left: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
    } as DOMRect;

    const anchorRect = wrapperRef.current?.getBoundingClientRect();
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    if (!anchorRect || !tooltipRect) return;

    const tooltipPosition = getTooltipPosition(defaultPosition, anchorRect, tooltipRect, containerSizes);

    // console.log('tooltipPosition-->', tooltipPosition);

    setPosition(tooltipPosition);
  }, [defaultPosition, isHovered]);

  return (
    <TooltipWrapperElement
      ref={wrapperRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={cx('relative cursor-default', className)}>
      {cloneElement(triggerElement as ReactElement<Record<string, unknown>>, {
        'aria-describedby': !disabled && isHovered ? tooltipId : undefined,
      })}

      {isHovered && (
        <div
          ref={tooltipRef}
          role="tooltip"
          id={tooltipId}
          className={cx(
            'flex flex-col items-center z-50 pb-0.5 w-[400px]',
            'transition-all duration-200 ease-in-out',
            'opacity-0 invisible',
            contentClassName,
            {
              'opacity-100 visible': isOpened,
            },
            POSITIONS_MAP[position],
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
    </TooltipWrapperElement>
  );
};

export default memo(NewTooltip);
