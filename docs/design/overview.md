# Design overview

The shared design language of the app. Each page document describes only what is specific to that page and links back here; rules that apply everywhere live here and are not repeated.

| Document                               | Covers                                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [home-redesign.md](./home-redesign.md) | Month grid, header, Agenda panel, Bottom sheet, sidebar. Also defines the visual system.       |
| [day-redesign.md](./day-redesign.md)   | Day page: masthead and Week strip, Day summary, Quick add, Day context, sidebar mini-calendar. |
| [`GLOSSARY.md`](../../GLOSSARY.md)     | Domain terms used in the docs, the code and the UI.                                            |
| [`docs/adr/`](../adr)                  | Hard-to-reverse decisions (for example Open-Meteo for Day conditions).                         |

Keep it this way: a design concept goes in the page document that owns it, a shared rule goes here, a term goes in the glossary, and only a hard-to-reverse trade-off becomes an ADR. Update the documents in the same change as the behaviour.

## 1. Principles

1. **Dark, square, hairline, technical.** No rounded cards; hairline borders; round shapes only for dots. Dark theme only; tokens are named by role, so a light theme later is a token change.
2. **Two colour channels that never mix.** _Calendar colour_ appears only on event marks (chips, dots, bars, Event mix segments, Quick add dots and its border), through the `--calendar-color` custom property. _Interface colour_ is **green = action** (buttons, selection, focus, open-state toggles) and **blue = info / today** (today, the Viewed day tint, the Conditions card). Calendar colours will become user-chosen, so they must never be mistakable for chrome. Destructive controls use the design system red (`red-400`), shown on the Day event Delete button.
3. **Meaning is never colour alone.** Every colour signal has a second one: an underline and label for today, a dashed line for an empty day, a dashed outline plus hollow bar plus italic text for a Dimmed event, names in `title` / sr-only text for calendar dots. Day cells are labelled "Monday 9 November, 3 events".
4. **Totals ignore the Calendar filter, lists dim.** The filter produces Dimmed events (visible, never hidden, disabled). Counts, summaries and Event mix always count everything.
5. **The selected or viewed day is a place, not a hidden state.** On Home the selected date lives in Redux and opens the Agenda panel; on the Day page the URL (`/day/YYYY-MM-DD`) is the Viewed day and nothing keeps a second copy. Browsing (swiping a week, stepping the sidebar month) never changes it; only picking a day does.
6. **Primary actions are reachable by touch and keyboard.** Nothing is hover-only. Mobile controls are 44px targets (a Quick add dot is 28px wide by 44px high). Desktop keyboard shortcuts exist on the Day page and are suppressed while typing.

## 2. Visual system

The tokens, the two type faces and the motion rules are defined in [home-redesign.md](./home-redesign.md) section 3 and in `src/index.css`. Summary:

- **Tokens** (`@theme`): surfaces `surface-base/-sunken/-raised/-overlay`, lines `line/line-strong`, text `text/-muted/-faint`, `action`, `info`. Use them as Tailwind utilities; do not hard-code hex values.
- **Type**: `font-display` (Inter Tight 800) for numerals and titles, `font-mono` (JetBrains Mono) for counts, labels, calendar names and button labels.
- **Focus**: global 2px green `:focus-visible` outline on every interactive element.
- **Motion**: 150-300 ms, transform and opacity, nothing on page load. A global base layer gives every `button`, `a[href]`, `[role=button]`, `summary` and `label` a 150 ms ease-out transition on colour, border, opacity, shadow and transform, so hover and press states never snap. `animate-fade-in` (300 ms opacity) is available for content that appears. Reduced motion zeroes all of it, and motion-library animations also check `useReducedMotion`.
- **Icons**: small 16px square-cap line icons that follow `currentColor` (the Day context icons in `pages/Day/components/DayContext/icons.tsx`). A panel icon whose rail is filled means "open".

## 3. Patterns shared across pages

- **Layered mobile panels.** Both pages put secondary content in a draggable **Bottom sheet** over the page (Home: the day's events; Day: Day context), with the same drag, velocity and snap rules, and instant movement under reduced motion. The Day page's closed sheet is a **Context button** in a solid docked bar (top border, `surface-sunken`, safe-area padding) so scrolling content never shows through around the floating buttons.
- **Week and month browsing without selecting.** The Day page Week strip (chevrons on desktop, swipe on mobile) and the sidebar mini-calendar's month buttons browse without changing the Viewed day or Home's Month grid. A **Back to {day}** control returns to the viewed week; **Today** drops all browsing. See "Today" below.
- **Today.** The Today actions (header Today on Home, masthead Today and the `T` shortcut on the Day page) all dispatch `requestToday` from the date slice. That bumps `todayRequests`, which the sidebar mini-calendar watches to drop its own month browsing; the Day masthead also resets its week offset. Any new Today control must do the same.
- **Sidebar mini-calendar** (`components/common/MonthSmallCalendar`). One component on both pages. The shown month starts from the Viewed day (Day) or Home's visible month and the month-step buttons browse from there on both pages. Day buttons carry labels and event dots; the grid is one tab stop with arrow-key movement. A click opens the day (Day) or selects it and re-opens the Agenda panel (Home).
- **Blocks fail silently.** Optional data blocks (AI insights, Conditions) render nothing on error or an unsupported date, show a fixed-height skeleton while loading, and prompt only for a deliberate state such as "Set location".
- **Persistence stays out of the reducers.** Slices persist through listener middleware (see `CLAUDE.md`); a new feature that stores data adds a listener, not storage calls in components.

## 4. Accessibility baseline

AA text contrast on dark surfaces; one `<h1>` per page; labelled day cells with `aria-current="date"` on the Viewed day; toggles use `aria-pressed` / `aria-expanded`; closed drawers and sheets are `inert` and focus returns to the trigger on close; Escape closes panels; visible green focus ring everywhere; 44px mobile targets; no colour-only meaning; reduced motion respected.

## 5. Verification

There is no test runner. After a design change: check desktop width and a 390px viewport with seeded events in all four calendars, a keyboard-only pass, reduced motion, and contrast and target-size spot checks. `npm run build`, `npm run lint:all` (0 warnings) and formatting must pass. Page-specific checklists are in each page document.

## 6. Adding to the docs

- New page or area: add `docs/design/<area>-redesign.md` with problems and decisions, key concepts, layout, components, state, accessibility, verification and open follow-ups, and link it in the table above and in `CLAUDE.md`.
- New shared rule: add it here and remove any duplicate from the page documents.
- New domain term: `GLOSSARY.md`, definitions only.
- Hard-to-reverse, surprising trade-off: `docs/adr/NNNN-title.md`.
