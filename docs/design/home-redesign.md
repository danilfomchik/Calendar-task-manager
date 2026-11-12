# Home page redesign: decisions and design concepts

Spec: [issue #56](https://github.com/danilfomchik/Calendar-task-manager/issues/56). This document describes what shipped on `integration/home-redesign`. Domain terms (**Visible month**, **Month grid**, **Month swipe**, **Calendar filter**, **Dimmed event**, **Agenda panel**, **Bottom sheet**) are defined in `GLOSSARY.md`. Rules shared with the Day page are collected in `docs/design/overview.md`.

Scope: header, Month grid, day cells, event chips, sidebar, mobile layout. Not touched: Day page, event form modal, Redux state shape and persistence, event data model.

## 1. Problems and decisions

| Problem                                                                                                            | Decision                                                                            |
| ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| A desktop day cell showed one event; height went to padding, the date row and a permanently reserved "N more" row. | Denser cell; the "N more" row exists only on real overflow.                         |
| "Open day" / "add event" were hover-only: invisible on touch, unreachable by keyboard.                             | Primary actions moved to the Agenda panel (desktop) and a floating button (mobile). |
| Clicking a day did nothing on desktop; "N more" navigated away.                                                    | Click selects the day and opens the Agenda panel; "N more" does the same.           |
| Mobile stack (Week strip, tiny chevron, events list, pill button) felt clunky.                                     | Month grid always visible; events in a draggable Bottom sheet; floating add button. |
| Hard-coded hex values, no identity, nothing for the Day page to inherit.                                           | Role-named dark tokens and a two-face type system.                                  |

## 2. Key design concepts

1. **One selection model on both platforms.** The selected date is meaningful on desktop too. Selecting a day shows its events beside the grid (desktop) or over it (mobile). Nothing navigates away unless the user picks **Open day**.
2. **Two colour channels that never mix.**
   - _Calendar colour_: only event chips, dots and bars, via the `--calendar-color` custom property set from `getCalendarColor`.
   - _Interface colour_: only **green = action** (buttons, selection, focus) and **blue = info** (today).
     Calendar colours will become user-chosen, so they must never be mistakable for chrome.
3. **Today loud, selection quiet.** Today is a filled blue numeral. The selected day gets a green outline, plus a green underline on the numeral when it isn't today. Both can share a cell without competing.
4. **Meaning is never colour alone.** Dimmed events use a dashed outline, no fill, hollow bar and faint italic text. A selected calendar has a green left bar as well as its dot ring. Cell buttons carry `aria-label` ("Monday 9 November, 3 events") and `aria-pressed`. Chips have a `title` with the calendar name.
5. **Calendar filter semantics are unchanged.** Empty filter = no filtering. A non-empty filter produces **Dimmed events**: visible, never hidden, `disabled` in the grid _and_ in the Agenda panel/Bottom sheet (both use `isEventDimmed`). Sidebar counts ignore the filter.
6. **Square, hairline, technical.** No rounded cards; hairline borders; round shapes only for dots.

## 3. Visual system

### Tokens

Defined in `src/index.css` under `@theme`, dark only, named by role. Used as Tailwind utilities (`bg-surface-raised`, `border-line`, `text-text-muted`, `bg-action`, …).

| Role     | Tokens                                           | Values                                                    |
| -------- | ------------------------------------------------ | --------------------------------------------------------- |
| Surfaces | `surface-base`, `-sunken`, `-raised`, `-overlay` | `#0b0c0e`, `#08090a`, `#121417`, `#181b1f`                |
| Lines    | `line`, `line-strong`                            | `#22262b`, `#343a41`                                      |
| Text     | `text`, `text-muted`, `text-faint`               | `#f3f5f7`, `#a3acb6`, `#7d8791` (faint passes AA on base) |
| Action   | `action`, `action-ink`                           | `#35e08a`, `#04140b`                                      |
| Info     | `info`, `info-ink`                               | `#5aa2ff`, `#04101f`                                      |

Tokens are named by role, not value, so the Day page redesign can reuse them and a light theme later is a token change. No theme toggle. Hues may still be tuned.

### Typography

- `font-display`: Inter Tight, weight 800 with tight tracking, for numerals, month title and brand.
- `font-mono`: JetBrains Mono, for counts, weekday labels, calendar names, metadata and button labels.
- Loaded from a Google Fonts `<link>` in `index.html`.

### Motion and focus

- 150–200 ms, transform and opacity; no animation on page load. A base layer in `src/index.css` gives every `button`, `a[href]`, `[role=button]`, `summary` and `label` a 150 ms ease-out transition on colour, border, opacity, shadow and transform.
- Global `:focus-visible`: 2px `--color-action` outline, 2px offset, on every interactive element.
- Global `prefers-reduced-motion` rule zeroes transition/animation durations; motion-library animations also check `useReducedMotion`.

## 4. Components

### Header (`pages/Main/components/Header`)

- Month/year is the large display title and the picker trigger (`CalendarDatePicker`).
- Controls are demoted: hairline square buttons `‹` Today `›`. Today also dispatches `requestToday`, which resets the sidebar mini-calendar's month browsing. The green **+ Add event** (`AddEventButton`) is the only filled control and creates on the selected date.
- Height `h-16` on mobile, `h-22` from `md` (exposed as `--height-home-header`).
- Mobile: no prev/next arrows (Month swipe covers it) and no header add button (the Bottom sheet's floating button does that); Today stays; touch targets are 44px.
- `SidebarToggle` (`components/common`): square, hairline, panel glyph with the rail filled when open, `aria-expanded`. On desktop it shows in the header only while the sidebar is closed (`md:hidden` when open) and in the sidebar header when open.

### Day cell, desktop (`Calendar/Day`, `DayEventsList`, `Event`)

- Header row: oversized numeral (22px) and a mono count badge; padding reduced to `p-1.5`.
- Chips: 20px high, 2px gap, 3px calendar bar plus truncated title. No start time, because events have no time field and adding one is out of scope.
- Capacity is measured with a `ResizeObserver`: `floor((height + gap) / (chip + gap))`. A slot is reserved for "+N more" only when `count > slots`. The 6×7 grid still fits one screen.
- Days from neighbouring months: sunken background and faint numeral.
- Clicking anywhere in the cell, or the numeral button, calls `openFor(date)`. Chip clicks and "+N more" stop propagation; "+N more" selects the day and opens the panel instead of navigating.

### Day cell, mobile

- Numeral plus up to three calendar-colour dots and a mono `+` when there are more (`DottedEventsList`). Minimum height 44px.
- Tapping selects the date (tapping the Visible month's own date resets to today, as before). **Month swipe** is unchanged.

### Agenda panel (`AgendaPanel`, `AgendaPanelContext`)

- Right-hand panel, 340px (`w-85`), sunken surface, left hairline, hidden below `md`. Height is viewport minus the home header.
- Header: weekday (mono), 7xl day numeral, `Month YYYY · N events`, and a close `×`.
- Body: the day's full event list (`AgendaEvent`: calendar bar, semibold title, mono `CALENDAR · description`), dimmed events per rule 5. Empty day: one "No events" line with an inline green "Add event".
- Footer: green **+ Add event** (a plain button in the same recipe as the other green actions, no longer the shared `Button`) and **Open day ↗** (link to `/day/YYYY-MM-DD`).
- State lives in `AgendaPanelProvider`:
  - Open by default. `openFor(date)` selects the date and re-opens it; `close()` and Escape dismiss it.
  - Dismissal is the user's own choice; shrinking below `md` hides the panel without recording a dismissal, so it returns on resize back to desktop.
  - The Month grid takes the remaining width when closed (`flex-1 min-w-0`), so nothing overlaps or clips with the sidebar open or closed.
- Enter: 180 ms fade plus 24px slide, skipped under reduced motion.

### Bottom sheet (`BottomSheet`, mobile)

- Layer over the Month grid, `md:hidden`. The calendar reserves `SHEET_PEEK` (232px) of bottom padding so the grid is never covered while collapsed.
- Two snap positions: collapsed (peek) and expanded (layer height minus a 72px top gap).
- Drag starts from the 44px grab handle or the date header; release with velocity beyond ±250 px/s snaps in that direction, otherwise to the nearest half. Settling uses a spring; instant under reduced motion. A click within 150 ms of a drag end is ignored so a drag doesn't also toggle.
- The handle is also a button (`aria-expanded`, "Expand/Collapse events").
- Content: big numeral, weekday, `MMM YYYY · N events`, **Open day ↗**, then the scrollable list (same `AgendaEvent` rows, same dimmed rule) or the empty-day line.
- **Floating add button**: 56px green square on the sheet's top-right edge; creates on the selected date. Replaces the pill button and the collapse chevron.

### Sidebar (`components/layout/Aside`)

Restyle only. Brand link in the display face; mini-calendar with mono month label and weekday letters, today as a blue filled square, selected day as a green outline (made interactive by the Day page redesign, which also added month-step buttons here; see `day-redesign.md`). **My calendars**: dot, name, mono count; a selected row has a raised background and green left bar; keyboard `option` rows toggle with Enter/Space. **Clear filter** is a square chip showing the active count (44px min height on mobile). On mobile the sidebar is an overlay and filtering works as on desktop. It does not animate on page load.

## 5. Removals

Week strip, Collapsed calendar, Edge cue, Week swipe and Initial week were removed (UI, state, hooks) along with their glossary entries and the rules on week ownership and "Week swipe moves the selected date". This intentionally reverses the earlier edge-cue / week-strip work. `GLOSSARY.md` gained **Agenda panel** and **Bottom sheet** and the Month swipe wording no longer mentions the Collapsed calendar.

## 6. Accessibility

AA text contrast on dark surfaces; 44px touch targets on mobile; visible green focus ring everywhere; controls that were hover-only are reachable by keyboard; Escape closes the Agenda panel; no colour-only meaning; reduced motion respected.

## 7. Manual verification (no test runner)

At desktop width and a 390px viewport with seeded events in all four calendars: a busy day shows several chips and "N more" only on real overflow; day click and "N more" open the panel; Open day reaches the Day page; dimmed events correct in grid and panel, Clear filter restores them; sidebar counts unchanged by the filter; Bottom sheet drags, settles and lists events, floating add works, Month swipe changes the month; keyboard-only pass with focus ring; reduced motion; contrast and target-size spot checks. `npm run build`, `npm run lint:all` (0 warnings) and formatting must pass.

## 8. Open follow-ups

- ~~Make the sidebar mini-calendar clickable, or remove it.~~ Done in the Day page redesign.
- Final tuning of the green/blue hues and the typeface pair.
- Manual check of the Bottom sheet's expanded state and the month picker on narrow screens.
- ~~Day page redesign will consume the same tokens.~~ Done; see `day-redesign.md`.
- Future user-chosen calendar colours rely on the two-channel rule (concept 2).
