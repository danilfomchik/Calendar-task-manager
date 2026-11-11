# Day page redesign: decisions and design concepts

Spec: [issue #65](https://github.com/danilfomchik/Calendar-task-manager/issues/65) (tickets #66 to #77). This document describes what shipped on `integration/day-redesign`. Domain terms (**Viewed day**, **Week strip**, **Event mix**, **Day summary**, **Quick add**, **Day context**, **Conditions**, **Upcoming**, **Day note**, plus Home's **Calendar filter**, **Dimmed event** and **Bottom sheet**) are defined in `GLOSSARY.md`. The visual system (tokens, type, focus, motion) is the one described in `docs/design/home-redesign.md` and is not repeated here.

Scope: the Day page (`src/pages/Day`), the sidebar mini-calendar, two new persisted slices (`dayNotes`, `location`) and a weather API. Not touched: the Month grid, Agenda panel, Home's Bottom sheet, the event form modal and the event data model.

## 1. Problems and decisions

| Problem                                                                                      | Decision                                                                                                      |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Hardcoded colours, an old header and a big lone numeral: it looked like a different product. | Home's tokens only; a masthead replaces the header and the hero.                                              |
| No sense of the surrounding week and no quick way to move to the next day.                   | A **Week strip** in the masthead: the whole week, each day's **Event mix**, click or chevron to step.         |
| No overview of what kind of day it is.                                                       | A **Day summary** (count plus per-calendar chips) above the list.                                             |
| Adding an event always meant the full form.                                                  | **Quick add**: title plus calendar dots, Enter adds on the Viewed day. The full form is still one click away. |
| Nothing to see beyond the events (except an optional AI blurb).                              | A **Day context** drawer: AI insights, **Conditions**, **Upcoming**, **Day note**.                            |
| Mobile was a long stack that either wasted space or forced a scroll.                         | Compact masthead with the Week strip as the hero; Day context in a Bottom sheet behind a floating button.     |
| The sidebar mini-calendar was decoration (an open follow-up from Home).                      | It is now a day navigator: clickable days, event dots and a Viewed day highlight.                             |

## 2. Key design concepts

1. **Poster masthead plus drawer.** Of the prototype variants, variant E was chosen: the masthead carries the week, the body carries the day, the drawer carries everything else. It replaced an earlier plan with a three-column layout (a "Neighbouring days" column on the left) and Events | Insights tabs on mobile. The Week strip replaced Neighbouring days as the way to step between days.
2. **The URL is the Viewed day.** Day cells, chevrons, Upcoming rows, mini-calendar days and the `←` / `→` / `T` shortcuts are all navigations to `/day/YYYY-MM-DD`; nothing keeps a second "current day" in state. A bad date still hits the router's 404.
3. **Totals ignore the filter, the list dims.** The Calendar filter produces Dimmed events in the events list, exactly as on Home. The Day summary, Event mix and Upcoming always count every event, so a forgotten filter can't hide what the day holds.
4. **Same two colour channels as Home.** Calendar colour only on event marks (Event mix segments, chips, list bars, Quick add dots). Green for action (Add event, Quick add focus, open drawer toggle), blue for info and today (the Viewed day tint, today's numeral, the Conditions card).
5. **Meaning is never colour alone.** Today has an underline and a "Today" label as well as blue. Empty days have a dashed line, not just no colour. Chips and Quick add dots carry the calendar name (text or `title`, plus sr-only labels). Day cells are labelled "Monday 9 November, 3 events" (", today" when it applies) and the Viewed day has `aria-current="date"`.
6. **Blocks fail silently, prompts are deliberate.** AI insights and Conditions render nothing on error, disabled flag, malformed data or an unsupported date, and show a fixed-height skeleton while loading so the drawer doesn't jump. The one non-data state that is shown on purpose is Conditions' "Set location" prompt. Conditions waits at most 4 s for the device position before showing it ("Still waiting for your location"), because the browser's own timeout only starts once its permission prompt is answered; a position that arrives later still replaces the prompt.
7. **A Day note is not an event.** It has its own slice and storage key and never feeds the Month grid, Day summary, Event mix or calendar counts.

## 3. Layout

### Desktop

- **Masthead** (`components/Masthead`). Top row in Home's header classes (`h-22`): `SidebarToggle` (hidden while the sidebar is open), **Back to month** (hairline control, `‹ November 2026`; returns to the month Home showed, see **Back to month rule** below), then on the right the **Day context** toggle (`aria-pressed`, `aria-controls`, green while open) and the green **+ Add event**, bound to the Viewed day rather than Home's selected date. The Week strip sits below.
- **Body.** A main column with the Day summary, Quick add, the events list and, at the bottom, a discreet **keyboard shortcuts hint**. The Day context drawer is a 320px aside on the right.

### Mobile (below `md`)

**Back to month rule.** The Day page never writes the date slice, so while Home's Month grid has been shown in this session (the in-memory `hasShownMonthGrid` flag, set when Home mounts) the slice still holds the month and selected date the user came from: Back to month shows that month in its label and returns to it with both untouched, however many days were stepped through on the Day page. On a direct load or reload of a Day URL there is no such month, so it falls back to the Viewed day's month and selects the Viewed day. It navigates to `/` rather than `navigate(-1)`, which would land on the previous day or leave the app.

- Header: sidebar toggle, Back to month, a "Week N" label and, after a swipe away from the Viewed day's week, a **Back to {day}** control. The header row is full at 390px while Back is shown; below 390px the "Week N" label hides then.
- The Week strip is the hero, with no chevrons. The Viewed day is about 2.4x wide; the six compact cells are about 44px each at 390px.
- The Day summary shows the visible `<h1>` ("Wednesday, 11 November"), count and chips; then Quick add and the list. Bottom padding clears the floating stack.
- A fixed bottom-right stack: the **Context** button above the floating green **+**. The Context button opens the Day context in a Bottom sheet.

## 4. Components

### Week strip (`components/WeekStrip`)

- Monday to Sunday (`isoWeek`), derived from the Viewed day alone, so moving to a day in another week re-centres it.
- The Viewed day (`ViewedDayCell`) is expanded about 2.6x with the blue info tint, a top rule, the display numeral, the weekday, "Month YYYY, week N" and a Today label when it applies. It keeps calendar colours even in the past.
- Compact days (`DayCell`) are router links showing the Event mix (`MixBar`, `useEventMix`). "Past" means before today: faint numeral, grey segments. Weekends use the sunken surface; empty days a dashed line. The neighbours of the Viewed day hint "Previous" / "Next" on hover; the Today label wins over that hint.
- Chevrons (`StepLink`, desktop only) step one day and cross week and month boundaries.
- Mobile swipe: the `<ol>` is wrapped in Home's `SwipeSlide`; a swipe changes a week offset held by the Masthead, never the Viewed day. Any navigation resets the offset. A week without the Viewed day shows seven compact cells.

### Day summary (`components/DaySummary`)

Display-face count with a mono "events" label, then one chip per calendar with events, in calendar order, each with its name. "0 events" and no chips on an empty day. On desktop its `<h1>` is `sr-only`, since the masthead carries the date visually.

### Quick add (`components/QuickAdd`)

- A form with the title input and a `fieldset` of radio dots (44px targets on mobile, 32px on desktop). The current calendar is named in the placeholder and the input's label.
- Enter dispatches the same `addEvent` as the full form, so persistence and the calendar count map stay in sync. The input clears and keeps focus; an empty or whitespace title does nothing.
- Default calendar: the single Active calendar, else the last calendar used with Quick add in this session (module state, so it survives day changes but not a reload), else the first calendar. An explicit pick holds until the Calendar filter changes.

### Events list (`components/DayEventsList`)

Rows in Home's Agenda panel recipe (calendar bar, title, mono calendar and description). Clicking a row edits it; explicit Edit and Delete icon buttons give the keyboard path. Dimmed rows have a hollow bar, dashed border, italic faint title, sr-only "(filtered out)" and disabled controls. Empty: "No events" with an inline green Add event. Delete still has no confirmation, as before.

### Day context (`components/DayContext`)

- `DayContextProvider` holds the drawer and sheet state. The drawer is open by default; the state survives day changes. Only one of the drawer or the sheet is mounted at a time, so blocks never render twice.
- **Drawer**: `transition-[width] duration-300`, `motion-reduce:transition-none`, `inert` when closed.
- **Bottom sheet** (mobile): `role="dialog"` over a backdrop in a surface token. It closes on backdrop click, Esc or a downward drag from its header (velocity over 250 px/s or a third of its height); otherwise it snaps back. Closed, it sits fully below the screen and is `inert`. Focus moves to Close on open and back to the Context button on close. Instant under reduced motion.
- Blocks, in order, in `DayContextBlocks`; each is a square hairline card and returns `null` when it has nothing to show.
  - **AI insights**: the existing Groq holiday plus "Did you know" fact, in a gradient-framed card. The response parse is guarded; partial content keeps the valid half. Disabled, failing or malformed: nothing.
  - **Conditions**: info-tinted card with temperature range, a weather description, precipitation, wind, sunrise, sunset and moon phase. Open-Meteo forecast for about 92 days back to 15 ahead, the archive host for older days, hidden beyond. The moon phase is computed locally. Location: browser geolocation asked once and rounded to 2 decimals, or a city search on submit; stored in `localStorage`. "Change" on the card reopens the city search. See `docs/adr/0001-open-meteo-for-day-conditions.md` for the provider and privacy trade-off.
  - **Upcoming**: the next 3 days with events within 30 days after the Viewed day, each a link with the date, count and first title. On mobile, following a row closes the sheet. Empty: "Nothing in the next 30 days".
  - **Day note**: a dashed "+ Add a note" line until used, then a textarea. Saved on blur (and on unmount, so swapping the drawer for the sheet mid-edit loses nothing); an emptied note is removed.

### Keyboard shortcuts (`hooks/useDayShortcuts`, `components/ShortcutsHint`)

Desktop only: `←` / `→` previous / next day, `T` today, `N` the add-event form on the Viewed day. Ignored with modifier keys, while a text field is focused and while a modal or menu is open. The hint lists them in `kbd` chips.

### Sidebar mini-calendar (`components/common/MonthSmallCalendar`)

Days are buttons with an accessible label and event dots. The grid is one tab stop (roving tabindex): arrow keys move by a day or a week, Home / End go to the start / end of the week row, within the six weeks shown; the tab stop sits on the last day reached, else the highlighted day, else today. On the Day page a click opens that day, the Viewed day is highlighted and the shown month follows the URL with its own month-step buttons; on mobile the sidebar overlay closes after the tap so the opened day is visible. On Home a click selects the date, as clicking a cell does, and re-opens the Agenda panel; the sidebar stays open, as it did before. That re-open is the only change to the Agenda panel: `AgendaPanelProvider` now sits in `MainLayout` so the sidebar can call `openFor`, it is never open off Home, and leaving Home forgets a dismissal, as when it unmounted with the Home page. Below `md` the sidebar overlay is 344px wide (at most the viewport minus 1rem) so the days are 44px targets; from `md` it stays the 240px column.

## 5. State and persistence

- `dayNotes` slice: `notesByDate` (date → text), hydrated from `localStorage` (`dayNotes`) in its initial state and written by `dayNotesListener` after `setDayNote`.
- `location` slice: `{location, geolocationStatus}`, hydrated from `conditionsLocation` and written by `locationListener`. `requestDeviceLocation` only runs while there is no location and the status is `idle`, so it is safe to dispatch on every mount.
- `conditionsApi`: RTK Query with absolute URLs per host, a 20 s timeout and a one-hour cache.
- Events are unchanged: Quick add uses `addEvent`, so the events listener and the calendar count map work as before.

## 6. Removals

The `?variant=prototype` (variant E) and `?variant=old` switches and the prototype folder are gone, along with the blocks only they used: the old Day header and hero, `components/AIInfo`, the shared `EventsList` / `EventsListItem`, `NoEventsMessage`, `OpenSidebarBtn`, Home's old `Controls/AddEvent`, the old `Tooltip` and `Divider`, three unused icons and the `--height-header` token. `GLOSSARY.md` gained Viewed day, Week strip, Event mix, Day summary, Quick add, Day context, Conditions, Upcoming and Day note, and the Bottom sheet entry now covers the Day page. **Week strip** was retired by the Home redesign along with an older mobile control of that name; the term now means the Day page masthead row only. "Neighbouring days" was a planning term and never reached the glossary.

## 7. Accessibility

The page always has one `<h1>`; labelled day cells with `aria-current="date"`; the drawer toggle has `aria-pressed`, the Context button `aria-expanded`; closed drawer and sheet are `inert`; focus returns to the trigger when the sheet closes; visible green focus ring everywhere, including Quick add's dots; 44px targets on mobile; no colour-only meaning; reduced motion turns off the drawer transition, the sheet animation, the Week strip slide and the skeleton pulse.

## 8. Manual verification (no test runner)

At desktop width and a 390px viewport, with seeded events in all four calendars: Week strip Event mix, Viewed day and today marks, empty / past / weekend days, day click and chevrons across week and month boundaries, mobile swipe and Back to {day}; Quick add default calendar in each filter state, empty title rejected, new event appears in list, Event mix, Day summary, sidebar counts and Month grid; filter dims the list only; drawer with and without reduced motion; Bottom sheet closes on Esc, backdrop and drag and is `inert` closed; Conditions with location granted, denied plus a city, none, and out of range; AI insights enabled, disabled, loading and failing; Day note persists and is in no count; shortcuts and their suppression; keyboard-only focus pass; day cell labels; contrast and 44px spot checks. `npm run build`, lint with 0 warnings and formatting must pass. The results of the final pass are recorded on #77.

## 9. Open follow-ups

- Event times and durations (timeline, "next up", free time), and a done state for events.
- A multi-day forecast in Conditions; switching back from a city to the device location.
- Day-level swipe on mobile.
- Delete has no confirmation or undo, on Home and the Day page alike.
- `ui/Tooltip/NewTooltip.tsx` is unused; finish adopting it or remove it.
- Sidebar mini-calendar: arrow keys stop at the edge of the six weeks shown instead of paging the month. Below 360px viewports the overlay narrows with the screen and its days drop under 44px.
- The event form modal still has the pre-redesign styling.
