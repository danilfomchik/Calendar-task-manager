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
The desktop panel beside the Month grid that lists the events of the selected day and lets the user open that day, add an event to it, edit one of its events, or edit its Day note in place. Clicking an event in the Month grid selects its day and points out that event here; editing starts from the panel. Its header shows the day's events total, the Calendar mix and the Holiday line; the Day note sits at its foot. It can be closed, and shown again from the header.

**Bottom sheet**:
The mobile sheet over the Month grid that lists the events of the selected day, with the same events total, Calendar mix, Holiday line and Day note as the Agenda panel. The user can pull it up to read more or push it down to see more of the calendar. On the Day page, the mobile sheet that holds the Day context; it opens from the Context button and closes on its backdrop, Esc or a downward drag.

**Free day**:
A selected day with no events, as the Agenda panel and the Bottom sheet show it: their events total reads "Free day" instead of "0 events", and the body leads with what is coming instead of saying the day is empty again: the **Next event** (the first event after the day), then **After that**, the next few days with events after it, each opening that day. In the Bottom sheet the Holiday line comes first on a free day. Both ignore the Calendar filter.

**First run**:
The state with no events anywhere. The Agenda panel and Bottom sheet hold its one empty state (how adding works, and on desktop an "Add to <day>" button; on mobile it points to the + docked beside the Bottom sheet's date); Home shows no empty-month note.

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
The row at the top of the Day page showing the Viewed day's week, Monday to Sunday. The Viewed day is expanded with its numeral, weekday, month and year; the other days are compact cells showing their Calendar mix (grey on past days), and clicking one opens that day. On desktop, chevrons at either end show the previous or next week; on mobile, a swipe does the same; neither changes the Viewed day.

**Quick add**:
The bar on the Day page that adds an event to the Viewed day from just a title and a calendar choice. Its calendar defaults to the single Active calendar when exactly one is chosen, otherwise the calendar last used with Quick add in this session, otherwise the first calendar. An empty title is not added. For anything more, the user opens the full event form.

**Day context**:
The supporting blocks for the Viewed day, in order: AI insights, Conditions, Upcoming and the Day note. On desktop they sit in a drawer beside the events that is open by default and is opened and closed with the Context tab; on mobile they open in a Bottom sheet from the Context button.

**Context tab**:
The desktop handle of the Day context drawer. It is attached to the drawer's edge, so the drawer and its handle read as one thing, and it stays at the right edge of the screen while the drawer is closed.

**Context button**:
The mobile control that opens the Day context Bottom sheet. Closed, it looks like the top of that sheet peeking above the bottom of the screen, with a chip for each block that has something to show (weather, upcoming, note, insights) that swipe sideways when they don't all fit, and it opens by a tap or an upward swipe.

**Conditions**:
The Day context block with the weather (temperature range, rain or snow, wind), daylight, sunrise, sunset and moon phase for the Viewed day at the user's location. The weather itself is shown as a **Dial** rather than written out. The location is the user's saved one (the device position or a searched city), else an **Approximate location** near the browser's time zone, shown at once and labelled as approximate. The browser is asked for the device position once, and a position that arrives replaces the approximate one. The user can search for a city, or ask again for the device position, at any time. Only if no location can be found at all does the block show a "Set location" prompt; for days outside the weather service's range it is hidden.

**Dial**:
The round instrument at the left of Conditions. Its ring fills with the chance of rain (left empty for days that only have recorded rainfall, never a forecast), a pointer on the ring marks the direction the wind comes from, and its face holds the **Sky scene** with the day's high and low over it.

**Sky scene**:
The illustration inside the Dial that stands for the day's weather: clear, partly cloudy, overcast, fog, rain, snow or storm. A night sky with stars stands in when there is no weather to show. It moves gently, and stands still for people who ask for less motion.

**Approximate location**:
The city nearest the browser's time zone, used by Conditions until a saved location exists. It is never saved and is always labelled as approximate.

**Upcoming**:
The Day context block listing the next three days after the Viewed day that have events, within 30 days. Each day is a group: its date and a few of its events, each in its calendar's colour, with a "+N more" for the rest; the group opens that day. It ignores the Calendar filter.

**Calendar mix**:
The day's events split by calendar, in the Agenda panel, the Bottom sheet and the Day page: one segment per calendar, sized by its share of the day's events, so it shows which calendars dominate the day. It ignores the Calendar filter; a filtered-out calendar is shown hatched rather than removed, so the day keeps its shape. Also shown on the Day page, in the Week strip cells and under the events total.

**Holiday line**:
The one line in the header of the Agenda panel and the Bottom sheet that names the selected day's holiday, taken from the same answer as AI insights. It shows only the name, labelled as AI output with where the holiday is observed (a country, or worldwide); selecting it opens a popover with that answer in full (name, description and the fact). It is blank when the day has no holiday or AI insights are switched off; when the answer fails it says so and offers Retry. Its space is kept free whenever AI insights are on, so the events below do not move when a day is selected.

**Day note**:
One plain-text note per date, kept in the Day context and saved automatically as the user writes. It is also written in place in the Agenda panel and the Bottom sheet, as a single row that grows with the text while it is written and shows two lines at rest, with Show more for a longer note; the note is the same one in both places. An emptied note is removed, and the note can also be removed in one click. A Day note is not an event: it never appears in the Month grid, the Calendar mix or any event count.

## Rules

- A Month swipe behaves exactly like the header arrows: it changes the Visible month and leaves the selected date untouched.
- Every change of the Visible month after Home opens is announced to screen readers by its name and year, whatever caused it.
- Today changes both: it shows today's month and selects today. When the selected date is outside the Month grid, the Agenda panel and Bottom sheet say it is not in view and offer to go to its month.
- Clicking a calendar in the sidebar toggles it in or out of the Calendar filter; no modifier key is needed.
- An empty Calendar filter means no filtering: no event is a Dimmed event.
- The Calendar filter does not affect the per-calendar event counts shown in the sidebar.
- On the Day page the Calendar filter only produces Dimmed events in the events list; the events total, Calendar mix and Upcoming always count every event.
- A Week strip swipe changes the week shown, never the Viewed day; only picking a day (a cell, the mini-calendar, the arrow keys or Today) changes the Viewed day.
