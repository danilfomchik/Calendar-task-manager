// PROTOTYPE, throwaway. Blocks for variant A (shared by B, C, D).
import {useState} from 'react';
import {useSelector} from 'react-redux';

import {isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars} from '@/redux/myCalendars/selectors';
import {cx} from '@/services/utils';
import {CalendarsNames} from '@/types/types';

import {MOCK_AI, MOCK_CONDITIONS, MOCK_EVENTS, MOCK_SUMMARY} from './mock';

export const Kbd = ({children}: {children: React.ReactNode}) => (
  <kbd className="font-mono inline-flex h-5 min-w-5 items-center justify-center border border-line-strong bg-surface-sunken px-1 text-[10px] text-text-muted">
    {children}
  </kbd>
);

// Calendar filter: dimmed events stay visible but disabled, like Home. Summary ignores the filter.
export const EventsFiltered = () => {
  const active = useSelector(selectActiveCalendars);
  return (
    <ul className="flex flex-col gap-1.5">
      {MOCK_EVENTS.map(e => {
        const dimmed = isEventDimmed(active, e.calendar as CalendarsNames);
        return (
          <li key={e.id}>
            <button
              type="button"
              disabled={dimmed}
              title={dimmed ? `${e.title} (filtered out)` : 'Click to edit event'}
              className={cx(
                'flex min-h-11 w-full items-stretch gap-3 border text-left transition-colors',
                dimmed
                  ? 'cursor-not-allowed border-dashed border-line-strong'
                  : 'border-line bg-surface-raised hover:border-line-strong hover:bg-surface-overlay',
              )}>
              <span aria-hidden className="w-1 shrink-0" style={{background: dimmed ? 'transparent' : e.color}} />
              <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 py-2 pr-3">
                <span
                  className={cx(
                    'truncate text-[15px] font-semibold leading-tight',
                    dimmed && 'italic text-text-faint',
                  )}>
                  {e.title}
                </span>
                <span className="font-mono truncate text-[11px] uppercase tracking-wider text-text-faint">
                  {e.calendar}
                  {e.note ? ` · ${e.note}` : ''}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

// Quick add: border takes the colour of the target calendar (the single Active one when exactly one is selected).
export const QuickAddTinted = () => {
  const active = useSelector(selectActiveCalendars);
  const [picked, setPicked] = useState(0);
  const single = active.length === 1 ? MOCK_SUMMARY.findIndex(s => s.calendar === active[0]) : -1;
  const idx = single >= 0 ? single : picked;
  const color = MOCK_SUMMARY[idx].color;
  return (
    <form
      onSubmit={e => e.preventDefault()}
      style={{borderColor: color}}
      className="flex min-h-12 items-center gap-2 border-2 bg-surface-sunken px-3 transition-colors">
      <input
        style={{outline: 'none'}}
        placeholder={`Add to ${MOCK_SUMMARY[idx].calendar}, press Enter`}
        className="min-w-0 flex-1 bg-transparent py-2 text-[15px] outline-none placeholder:text-text-faint"
      />
      <div className="flex gap-1.5">
        {MOCK_SUMMARY.map((s, i) => (
          <button
            key={s.calendar}
            type="button"
            aria-label={s.calendar}
            title={s.calendar}
            onClick={() => setPicked(i)}
            className={cx('size-4 rounded-full', i === idx && 'ring-2 ring-offset-2 ring-offset-surface-sunken')}
            style={{background: s.color, ['--tw-ring-color' as string]: s.color}}
          />
        ))}
      </div>
    </form>
  );
};

// Forecast: tinted info tile so it reads as a different kind of block from the event cards.
export const ForecastTile = ({compact}: {compact?: boolean}) => {
  const c = MOCK_CONDITIONS;
  return (
    <section
      aria-label="Forecast"
      className={cx(
        'flex flex-col gap-2 border border-info/40 bg-linear-to-br from-info/25 via-info/10 to-transparent p-3',
        compact ? 'w-full' : 'w-80',
      )}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-info">Forecast</span>
        <span className="font-mono text-[10px] uppercase text-text-muted">{c.summary}</span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <span className="font-display text-4xl font-extrabold leading-none">{c.range}</span>
        <span aria-hidden className="text-3xl leading-none">
          🌧
        </span>
      </div>
      <div className="font-mono flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] uppercase tracking-wider text-text-muted">
        <span>☂ {c.precip}</span>
        <span>≈ {c.wind}</span>
        <span>↑ {c.sunrise}</span>
        <span>↓ {c.sunset}</span>
        <span>☾ {c.moon}</span>
      </div>
    </section>
  );
};

// Day note is optional: one collapsed line until used.
export const NoteOptional = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  if (!open && !text) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono flex min-h-11 w-full items-center gap-2 border border-dashed border-line px-3 text-left text-[11px] uppercase tracking-widest text-text-faint hover:border-line-strong hover:text-text-muted">
        + Add a note for this day
      </button>
    );
  }
  return (
    <section className="flex flex-col gap-2 border border-line bg-surface-raised p-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Day note</span>
      <textarea
        style={{outline: 'none'}}
        autoFocus={open}
        rows={3}
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={() => !text && setOpen(false)}
        placeholder="Add a note for this day"
        className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-text-faint"
      />
    </section>
  );
};

// AI insights as a "wow" feature: gradient frame, big headline, fact callout.
export const AIWow = () => (
  <div className="bg-linear-to-br from-info via-action to-info p-px">
    <section className="relative flex flex-col gap-3 overflow-hidden bg-surface-sunken p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-action/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -left-10 size-40 rounded-full bg-info/20 blur-3xl"
      />
      <div className="relative flex items-center gap-2">
        <span aria-hidden className="text-action">
          ✦
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-action">AI insight</span>
      </div>
      <h3 className="font-display relative text-2xl font-extrabold leading-tight">Remembrance Day</h3>
      <p className="relative text-sm leading-relaxed text-text-muted">{MOCK_AI.holiday}</p>
      <div className="relative border-l-2 border-action bg-action/10 p-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-action">Did you know</span>
        <p className="mt-1 text-sm leading-relaxed">{MOCK_AI.fact}</p>
      </div>
    </section>
  </div>
);
