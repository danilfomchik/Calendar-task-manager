// Home's hairline secondary control (ChangeMonthControl): square corners, line-strong border, neutral hover.
// The base has no size or layout, so icon-only squares can add their own.
export const HAIRLINE_CONTROL_BASE_CLASS =
  'cursor-pointer items-center justify-center border border-line-strong text-text-muted transition-colors hover:border-text-muted hover:text-text';

// The labelled variant: Paragraph S label, 44px high on mobile, 36px from md
export const HAIRLINE_CONTROL_CLASS = `${HAIRLINE_CONTROL_BASE_CLASS} inline-flex h-11 gap-2 px-3 text-para-s md:h-9`;

// Exposes a calendar's colour to Tailwind as `(--calendar-color)`
export const calendarColorStyle = (color: string | undefined): React.CSSProperties =>
  ({'--calendar-color': color}) as React.CSSProperties;

// The solid green primary action (Add event, Create event): the only filled control on a surface
export const PRIMARY_ACTION_CLASS =
  'inline-flex h-11 cursor-pointer items-center justify-center gap-2 bg-action px-3 text-para-s text-action-ink hover:brightness-110 disabled:cursor-default disabled:opacity-50 disabled:hover:brightness-100 md:h-9';

// The green hairline action (Go to, the first-run Add to): an action label on a neutral hairline that turns green on
// hover and focus. For an action that sits beside the page's one filled control, so the surface never shows two solid
// greens. The base has no size or layout, like HAIRLINE_CONTROL_BASE_CLASS.
export const ACTION_HAIRLINE_BASE_CLASS =
  'cursor-pointer items-center border border-line-strong text-action transition-colors hover:border-action focus-visible:border-action';

// Text fields: square, sunken, one green ring on focus (the global outline is replaced, not doubled), rose when invalid.
// Paragraph M below md so iOS Safari doesn't zoom (docs/design/typography.md).
// The same ring on a wrapper that frames a text input beside other controls (Quick add, the city search): it lights
// only while the text input itself has focus, since the controls beside it ring themselves
export const TEXT_FIELD_GROUP_FOCUS_CLASS =
  'has-[input:not([type=radio]):focus]:border-action has-[input:not([type=radio]):focus]:shadow-[0_0_0_1px_var(--color-action)]';

export const TEXT_FIELD_CLASS =
  'w-full border border-line-strong bg-surface-sunken px-3 py-2.5 text-para-m text-text placeholder:text-text-faint transition-colors focus:border-action focus:shadow-[0_0_0_1px_var(--color-action)] focus-visible:outline-none! aria-invalid:border-danger md:text-para-s';
