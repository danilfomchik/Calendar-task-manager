// Home's hairline secondary control (ChangeMonthControl): square corners, line-strong border, neutral hover.
// The base has no size or layout, so icon-only squares can add their own.
export const HAIRLINE_CONTROL_BASE_CLASS =
  'cursor-pointer items-center justify-center border border-line-strong font-mono text-text-muted transition-colors hover:border-text-muted hover:text-text';

// The labelled variant: mono uppercase text, 44px high on mobile, 36px from md
export const HAIRLINE_CONTROL_CLASS = `${HAIRLINE_CONTROL_BASE_CLASS} inline-flex h-11 gap-2 px-3 text-[11px] uppercase tracking-wider md:h-9 md:text-xs`;
