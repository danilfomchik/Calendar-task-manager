import moment from 'moment';
import {animate, motion, useDragControls, useMotionValue, useReducedMotion} from 'motion/react';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import EventsList from '@/components/common/EventsList';
import ExternalPage from '@/components/ui/icons/ExternalPage';
import PlusIcon from '@/components/ui/icons/PlusIcon';
import {useEventsList} from '@/hooks/useEventsList';
import {selectSelectedDate} from '@/redux/date/selectors';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {EVENT_FORM_ID} from '@/services/constants';
import {FormActionType} from '@/types/eventFormTypes';

import {SHEET_PEEK} from './constants';

const TOP_GAP = 72;
const FLICK_VELOCITY = 250;

const BottomSheet = () => {
  const dispatch = useAppDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const events = useEventsList(selectedDate);
  const shouldReduceMotion = useReducedMotion();
  const dragControls = useDragControls();

  const layerRef = useRef<HTMLDivElement>(null);
  const [layerHeight, setLayerHeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const y = useMotionValue(0);

  useLayoutEffect(() => {
    const el = layerRef.current;
    if (!el) return;

    const measure = () => setLayerHeight(el.clientHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const sheetHeight = Math.max(layerHeight - TOP_GAP, SHEET_PEEK + 40);
  const collapsedY = sheetHeight - SHEET_PEEK;

  // place without animating on first measure / resize
  useEffect(() => {
    y.set(isExpanded ? 0 : collapsedY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsedY]);

  const settle = useCallback(
    (expand: boolean) => {
      setIsExpanded(expand);
      animate(
        y,
        expand ? 0 : collapsedY,
        shouldReduceMotion ? {duration: 0} : {type: 'spring', stiffness: 500, damping: 42, mass: 0.8},
      );
    },
    [collapsedY, shouldReduceMotion, y],
  );

  const handleAddEvent = () => {
    dispatch(onOpenItem(EVENT_FORM_ID));
    dispatch(setEventFormData({actionType: FormActionType.create, date: selectedDate}));
  };

  const day = moment(selectedDate);
  const eventsCount = events?.length ?? 0;

  return (
    <div ref={layerRef} className="md:hidden pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {layerHeight > 0 && (
        <motion.section
          aria-label={`Events for ${day.format('D MMMM')}`}
          drag="y"
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0.05}
          dragConstraints={{top: 0, bottom: collapsedY}}
          onDragEnd={(_, info) => {
            if (info.velocity.y < -FLICK_VELOCITY) settle(true);
            else if (info.velocity.y > FLICK_VELOCITY) settle(false);
            else settle(y.get() < collapsedY / 2);
          }}
          style={{y, height: sheetHeight}}
          className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col border-t border-line-strong bg-surface-raised shadow-[0_-12px_32px_rgba(0,0,0,0.55)]">
          <button
            type="button"
            aria-label="Add event"
            onClick={handleAddEvent}
            className="absolute -top-7 right-4 flex size-14 cursor-pointer items-center justify-center bg-action text-action-ink shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
            <PlusIcon size="size-7" />
          </button>

          <button
            type="button"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse events' : 'Expand events'}
            onPointerDown={e => dragControls.start(e)}
            onClick={() => settle(!isExpanded)}
            className="flex h-11 w-full shrink-0 cursor-grab touch-none items-center justify-center">
            <span aria-hidden className="h-1 w-10 bg-line-strong" />
          </button>

          <div
            onPointerDown={e => dragControls.start(e)}
            className="flex shrink-0 touch-none items-end gap-3 px-4 pb-3">
            <span className="font-display text-6xl font-extrabold leading-[0.85] text-text">{day.format('DD')}</span>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5 pb-0.5">
              <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                {day.format('dddd')}
              </span>
              <span className="font-mono text-xs text-text-faint">
                {day.format('MMM YYYY')} · {eventsCount} {eventsCount === 1 ? 'event' : 'events'}
              </span>
            </div>

            <Button
              kind="link"
              to={`/day/${selectedDate}`}
              text="Open"
              endIcon={<ExternalPage size="size-3" />}
              className="mr-14 h-11 px-2 text-xs"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
            <EventsList date={selectedDate} />
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default BottomSheet;
