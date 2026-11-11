// PROTOTYPE, throwaway. Shared presentational blocks (mock data only).
import {cx} from '@/services/utils';

import {MOCK_CONDITIONS, MOCK_NEIGHBOURS, MOCK_SUMMARY, MOCK_UPCOMING} from './mock';

export type DayCtx = {date: string; numeral: string; weekday: string; monthYear: string; month: string};

const Label = ({children}: {children: React.ReactNode}) => (
  <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-faint">{children}</h3>
);

export const Card = ({title, children, className}: {title: string; children: React.ReactNode; className?: string}) => (
  <section className={cx('flex min-h-24 flex-col gap-3 border border-line bg-surface-raised p-4', className)}>
    <Label>{title}</Label>
    {children}
  </section>
);

export const SummaryChips = ({small}: {small?: boolean}) => (
  <ul className="flex flex-wrap gap-1.5">
    {MOCK_SUMMARY.map(s => (
      <li
        key={s.calendar}
        title={s.calendar}
        className="font-mono flex items-center gap-1.5 border border-line px-2 py-0.5 text-[11px] text-text-muted">
        <span aria-hidden className="size-2 rounded-full" style={{background: s.color}} />
        {!small && <span className="uppercase">{s.calendar}</span>}
        {s.count}
      </li>
    ))}
  </ul>
);

export const DaySummary = () => (
  <div className="flex flex-col gap-2">
    <p className="font-display text-2xl font-extrabold">
      5 <span className="font-mono text-xs font-normal uppercase tracking-widest text-text-faint">events</span>
    </p>
    <SummaryChips />
  </div>
);

export const Caption = () => (
  <p className="font-mono text-[11px] uppercase leading-relaxed tracking-wider text-text-faint">
    Week 46 · Day 315
    <br />
    <span className="text-info">Today</span>
  </p>
);

export const Neighbours = () => (
  <div className="grid grid-cols-2 gap-px border border-line bg-line">
    {[
      {k: '‹', ...MOCK_NEIGHBOURS.prev},
      {k: '›', ...MOCK_NEIGHBOURS.next},
    ].map(n => (
      <button
        key={n.k}
        type="button"
        className="flex min-h-11 flex-col items-start gap-0.5 bg-surface-raised p-2 text-left hover:bg-surface-overlay">
        <span className="font-mono text-[11px] uppercase text-text-faint">
          {n.k} {n.label}
        </span>
        <span className="font-mono text-xs text-text-muted">{n.count} ev</span>
      </button>
    ))}
  </div>
);

export const Conditions = () => {
  const c = MOCK_CONDITIONS;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="font-display text-3xl font-extrabold">{c.range}</span>
        <span className="text-sm text-text-muted">{c.summary}</span>
      </div>
      <dl className="font-mono grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] uppercase tracking-wider">
        {[
          ['Precip', c.precip],
          ['Wind', c.wind],
          ['Sunrise', c.sunrise],
          ['Sunset', c.sunset],
          ['Moon', c.moon],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2 border-b border-line py-1">
            <dt className="text-text-faint">{k}</dt>
            <dd className="text-text-muted">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export const Upcoming = () => (
  <ul className="flex flex-col">
    {MOCK_UPCOMING.map(u => (
      <li key={u.date}>
        <button
          type="button"
          className="flex min-h-11 w-full flex-col items-start justify-center gap-0.5 border-b border-line py-1.5 text-left last:border-0 hover:text-action">
          <span className="font-mono text-[11px] uppercase text-text-faint">
            {u.date} · {u.count} ev
          </span>
          <span className="w-full truncate text-sm">{u.first}</span>
        </button>
      </li>
    ))}
  </ul>
);

export const AddBar = () => (
  <button
    type="button"
    className="font-mono mx-auto mb-4 flex h-11 w-[min(70%,260px)] items-center justify-center bg-action text-sm font-semibold uppercase tracking-wider text-action-ink">
    + Add event
  </button>
);
