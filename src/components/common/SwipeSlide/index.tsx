import {DragControls, PanInfo, motion} from 'framer-motion';
import {ReactNode, useRef} from 'react';

import {TDirection} from '@/services/dateUtils';

const SWIPE_DISTANCE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 500;
const SLIDE_OFFSET = 40;

interface ISwipeSlideProps {
  // changes whenever the slide content changes (week start, month); must be orderable
  slideKey: string;
  onSwipe: (direction: TDirection) => void;
  className?: string;
  // lets an element outside the slide (e.g. an edge cue) start the swipe
  dragControls?: DragControls;
  children: ReactNode;
}

const SwipeSlide = ({slideKey, onSwipe, className, dragControls, children}: ISwipeSlideProps) => {
  // 1 - next (slides in from the right), -1 - previous (slides in from the left)
  const directionRef = useRef<TDirection>(1);
  const prevKeyRef = useRef(slideKey);
  // stays false until the slide changes, so mounting (e.g. collapsing/expanding the calendar) doesn't animate
  const hasSlideChangedRef = useRef(false);

  // derive direction from the change itself, so header arrows and swipes animate the same way
  if (prevKeyRef.current !== slideKey) {
    directionRef.current = slideKey > prevKeyRef.current ? 1 : -1;
    prevKeyRef.current = slideKey;
    hasSlideChangedRef.current = true;
  }

  const handleDragEnd = (_: PointerEvent, {offset, velocity}: PanInfo) => {
    const isNext = offset.x < -SWIPE_DISTANCE_THRESHOLD || velocity.x < -SWIPE_VELOCITY_THRESHOLD;
    const isPrev = offset.x > SWIPE_DISTANCE_THRESHOLD || velocity.x > SWIPE_VELOCITY_THRESHOLD;

    if (!isNext && !isPrev) return;

    onSwipe(isNext ? 1 : -1);
  };

  return (
    <motion.div
      key={slideKey}
      drag="x"
      dragControls={dragControls}
      dragSnapToOrigin
      dragElastic={0.2}
      dragConstraints={{left: 0, right: 0}}
      onDragEnd={handleDragEnd}
      // no exit animation: AnimatePresence kept the dragged (exiting) element in the DOM after a right swipe
      initial={hasSlideChangedRef.current ? {opacity: 0, x: directionRef.current * SLIDE_OFFSET} : false}
      animate={{opacity: 1, x: 0}}
      transition={{duration: 0.2, ease: 'easeOut'}}
      className={className}>
      {children}
    </motion.div>
  );
};

export default SwipeSlide;
