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
- Header (`AgendaHeader`): the date block (`DayHeading`, shared with the Bottom sheet at a smaller size): an 88px day numeral (blue when it is today) beside the weekday (plus a mono blue "Today") over `Month YYYY`, as in the Day page's Viewed day cell, with a close `×` at the right; the events total (`components/common/EventsTotal`, shared with the Day page) over the **Calendar mix**; then the **Holiday line**.
  - **Calendar mix** (`CalendarMix`): a 3px bar with one segment per calendar, sized by its share of the day's events. No chips or labels: each event row already names its calendar, and the bar is decorative (`aria-hidden`). Counts ignore the Calendar filter; a filtered-out calendar stays in the bar hatched instead of filled, so filtering never changes the shape of the day. An empty day is a dashed hairline.
  - **Holiday line** (`HolidayLine`, chip view `HolidayLineChip`): a 32px row reserved only while AI insights are enabled. Skeleton while the selected date settles (400 ms) and loads, the holiday name as a gradient-edged chip when there is one, blank otherwise. A muted ↗ is always visible so the chip reads as clickable (it turns green on hover/focus/open). Hover/focus slide the gradient edge, grow the glows and rotate the sparkle, all motion-safe only; under reduced motion only the lighter fill and a static green ring remain. While the popover is open the chip holds the full hover look, glow included (active state). When the request fails the row shows a static rose "Couldn't load AI insights" with a **Retry** button instead of going blank (not a live region, so clicking through failing dates is not announced each time). Selecting the chip opens a popover (`components/common/Popover`: portalled, right-aligned under the chip, about 340px, or full width with a 16px inset on each side below a 640px layout viewport, flips up when there is no room, one at a time, below modals) with the full AI answer in an editorial layout. It closes on outside click, Esc, focus leaving it, a modal opening and a date change; focus moves in on open and returns to the chip on close (to the Holiday line row if the chip has gone), except when focus itself moved to another control.
- Body: the day's full event list (`AgendaEvent`: calendar bar, semibold title, mono `CALENDAR · description`), dimmed events per rule 5. Empty day: one "No events" line with an inline green "Add event".
- Footer: the **Day note** (the shared `components/common/DayNote`: no frame, a 2px left rule, dashed with a note icon and "Add a note" while empty, solid once written, green with a raised fill while editing; it grows from 1 to 6 lines while editing; at rest a long note is clamped to 2 lines with a Show more / Show less toggle (expanded, up to 6 lines, then it scrolls, so the footer never pushes the panel or sheet past the screen), the row, empty or written, has a tight 4px block padding and no minimum height, and the autosave confirmation is a green check in a fixed slot at the right so it never reflows the text; a muted × at the far right removes the note in one click, no confirmation, and the Day page uses the same note), then green **+ Add event** (a plain button in the same recipe as the other green actions, no longer the shared `Button`) and **Open day ↗** (link to `/day/YYYY-MM-DD`).
- State lives in `AgendaPanelProvider`:
  - Open by default. `openFor(date)` selects the date and re-opens it; `close()` and Escape dismiss it.
  - Dismissal is the user's own choice; shrinking below `md` hides the panel without recording a dismissal, so it returns on resize back to desktop.
  - The Month grid takes the remaining width when closed (`flex-1 min-w-0`), so nothing overlaps or clips with the sidebar open or closed.
- Enter: 180 ms fade plus 24px slide, skipped under reduced motion.

### Bottom sheet (`BottomSheet`, mobile)

- Layer over the Month grid, `md:hidden`. The calendar reserves `SHEET_PEEK` (232px) of bottom padding so the grid is never covered while collapsed.
- Two snap positions: collapsed (peek) and expanded (viewport height minus a 72px gap below the 64px header, so the sheet stops under the header). Expanded, a dimmed backdrop (the shared `Sheet` `modal` backdrop, as in the Day context Bottom sheet) covers the whole screen above it, header included (the layer is `fixed`, z-40, below the sidebar); it fades with the slide and the drag, and a tap on it or Esc collapses the sheet.
- Drag starts from the grab handle or the date header; release with velocity beyond ±250 px/s snaps in that direction, otherwise to the nearest half. Settling uses a spring; instant under reduced motion. A click within 150 ms of a drag end is ignored so a drag doesn't also toggle.
- The handle is also a button (`aria-expanded`, "Expand/Collapse events"). It is 24px tall in the layout, but a pseudo-element extends its hit area to 44px, overlapping the top of the date row (itself a drag area), so the peek budget stays intact.
- Content: 60px numeral (blue when it is today) beside the weekday (plus "Today") over `Month YYYY`, and **Open day ↗**; then the events total over the Calendar mix, as in the panel (not in the date row, where the floating + button covers the right edge), and the Holiday line (with its popover, portalled out of the sheet), then the scrollable list (same `AgendaEvent` rows, same dimmed rule) or the empty-day line; the Day note, in its `margin` appearance, is pinned below the list as the sheet's footer, so it shows only once the sheet is expanded and is inert while collapsed.
- At a 390px viewport the first event still fits in the 232px peek. The events total, Calendar mix and Holiday line block is not a drag area: it stops pointer-down so tapping the Holiday line chip never moves the sheet; neither does typing in the note. If the header grows, cut padding before dropping anything.
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
