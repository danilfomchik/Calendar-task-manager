import moment from 'moment';
import {
  AnimationPlaybackControls,
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
} from 'motion/react';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import {useEventsList} from '@/hooks/useEventsList';
import {selectSelectedDate} from '@/redux/date/selectors';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars} from '@/redux/myCalendars/selectors';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {EVENT_FORM_ID} from '@/services/constants';
import {FormActionType} from '@/types/eventFormTypes';

import AgendaEvent from '../AgendaPanel/AgendaEvent';
import {SHEET_PEEK} from './constants';

const TOP_GAP = 72;
const FLICK_VELOCITY = 250;
// a click right after a drag is the tail of that same gesture, not a tap
const CLICK_AFTER_DRAG_WINDOW_MS = 150;

const BottomSheet = () => {
  const dispatch = useAppDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const activeCalendars = useSelector(selectActiveCalendars);
  const events = useEventsList(selectedDate);
  const shouldReduceMotion = useReducedMotion();
  const dragControls = useDragControls();

  const layerRef = useRef<HTMLDivElement>(null);
  const [layerHeight, setLayerHeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const y = useMotionValue(0);
  const isExpandedRef = useRef(false);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const lastDragEndRef = useRef(0);

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
    animationRef.current?.stop();
    y.set(isExpandedRef.current ? 0 : collapsedY);
  }, [collapsedY, y]);

  const settle = useCallback(
    (expand: boolean) => {
      isExpandedRef.current = expand;
      setIsExpanded(expand);
      animationRef.current?.stop();
      animationRef.current = animate(
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
            lastDragEndRef.current = performance.now();
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
            className="absolute -top-7 right-4 flex size-14 cursor-pointer items-center justify-center bg-action font-mono text-3xl font-medium text-action-ink shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
            +
          </button>

          <button
            type="button"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse events' : 'Expand events'}
            onPointerDown={e => dragControls.start(e)}
            onClick={() => {
              if (performance.now() - lastDragEndRef.current < CLICK_AFTER_DRAG_WINDOW_MS) return;

              settle(!isExpanded);
            }}
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
              text="Open day ↗"
              className="h-8 shrink-0 rounded-none border-line-strong bg-transparent p-0 px-2.5 font-mono text-xs uppercase tracking-wider text-text-muted hover:text-text"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
            {eventsCount === 0 ? (
              <p className="font-mono text-xs text-text-faint">
                No events{' '}
                <button
                  type="button"
                  onClick={handleAddEvent}
                  className="-my-3 cursor-pointer px-1 py-3 text-action underline underline-offset-2">
                  Add event
                </button>
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {events?.map(event => (
                  <li key={event.id}>
                    <AgendaEvent event={event} isDisabled={isEventDimmed(activeCalendars, event.eventCalendar)} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default BottomSheet;
