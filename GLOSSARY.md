# Calendar Task Manager

Glossary of domain terms used in this project.

## Language

**Visible month**:
The month the calendar is currently showing, as named in the header.

**Month grid**:
The full 6×7 view of the Visible month, including dimmed days from neighbouring months.

**Month swipe**:
A horizontal gesture on the Month grid, on mobile only, that moves the Visible month to the previous or next month. It changes the Visible month and does not change the selected date.

**Agenda panel**:
The desktop panel beside the Month grid that lists the events of the selected day and lets the user open that day or add an event to it. It can be closed.

**Bottom sheet**:
The mobile sheet over the Month grid that lists the events of the selected day. The user can pull it up to read more or push it down to see more of the calendar. On the Day page, the mobile sheet that holds the Day context; it opens from the Context button and closes on its backdrop, Esc or a downward drag.

**Calendar filter**:
The set of Active calendars chosen in the sidebar. A user can have several Active calendars at once. Lives for the session only.

**Active calendar**:
A calendar that is currently in the Calendar filter.

**Clear filter**:
The sidebar action that removes every Active calendar at once, leaving the Calendar filter empty.

**Dimmed event**:
An event whose calendar is not an Active calendar while the Calendar filter is non-empty. It stays visible but greyed out and non-interactive; it is never hidden.

**Viewed day**:
The date the Day page is showing, taken from its URL (`/day/YYYY-MM-DD`). It is separate from the selected date on Home.

**Week strip**:
The row at the top of the Day page showing the Viewed day's week, Monday to Sunday. The Viewed day is expanded with its numeral, weekday, month, year and week number; the other days are compact cells showing their Event mix, and clicking one opens that day. On desktop, chevrons at either end step one day; on mobile, a swipe shows the previous or next week without changing the Viewed day.

**Event mix**:
The segmented bar in a compact Week strip day: one segment per event of that day, in its calendar's colour (grey on past days, a dashed line on an empty day). It counts every event and ignores the Calendar filter.

**Day summary**:
The event count of the Viewed day plus one chip per calendar that has events on it. It ignores the Calendar filter.

**Quick add**:
The bar on the Day page that adds an event to the Viewed day from just a title and a calendar choice. Its calendar defaults to the single Active calendar when exactly one is chosen, otherwise the calendar last used with Quick add in this session, otherwise the first calendar. An empty title is not added. For anything more, the user opens the full event form.

**Day context**:
The supporting blocks for the Viewed day, in order: AI insights, Conditions, Upcoming and the Day note. On desktop they sit in a drawer beside the events that is open by default and is opened and closed with the Context tab; on mobile they open in a Bottom sheet from the Context button.

**Context tab**:
The desktop handle of the Day context drawer. It is attached to the drawer's edge, so the drawer and its handle read as one thing, and it stays at the right edge of the screen while the drawer is closed.

**Context button**:
The mobile control that opens the Day context Bottom sheet. Closed, it looks like the top of that sheet peeking above the bottom of the screen, with a chip for each block that has something to show (weather, upcoming, note, insights), and it opens by a tap or an upward swipe.

**Conditions**:
The Day context block with the weather (temperature range, conditions, precipitation, wind), sunrise, sunset and moon phase for the Viewed day at the user's location. The location is the user's saved one (the device position or a searched city), else an **Approximate location** near the browser's time zone, shown at once and labelled as approximate. The browser is asked for the device position once, and a position that arrives replaces the approximate one. The user can search for a city, or ask again for the device position, at any time. Only if no location can be found at all does the block show a "Set location" prompt; for days outside the weather service's range it is hidden.

**Approximate location**:
The city nearest the browser's time zone, used by Conditions until a saved location exists. It is never saved and is always labelled as approximate.

**Upcoming**:
The Day context block listing the next three days after the Viewed day that have events, within 30 days. Each day is a group: its date and a few of its events, each in its calendar's colour, with a "+N more" for the rest; the group opens that day. It ignores the Calendar filter.

**Day note**:
One plain-text note per date, kept in the Day context and saved automatically as the user writes. An emptied note is removed. A Day note is not an event: it never appears in the Month grid, the Day summary, the Event mix or any event count.

## Rules

- A Month swipe behaves exactly like the header arrows: it changes the Visible month and leaves the selected date untouched.
- Clicking a calendar in the sidebar toggles it in or out of the Calendar filter; no modifier key is needed.
- An empty Calendar filter means no filtering: no event is a Dimmed event.
- The Calendar filter does not affect the per-calendar event counts shown in the sidebar.
- On the Day page the Calendar filter only produces Dimmed events in the events list; the Day summary, Event mix and Upcoming always count every event.
- A Week strip swipe changes the week shown, never the Viewed day; only tapping a day (or a chevron) changes the Viewed day.
