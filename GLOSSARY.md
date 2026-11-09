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
The mobile sheet over the Month grid that lists the events of the selected day. The user can pull it up to read more or push it down to see more of the calendar.

**Calendar filter**:
The set of Active calendars chosen in the sidebar. A user can have several Active calendars at once. Lives for the session only.

**Active calendar**:
A calendar that is currently in the Calendar filter.

**Clear filter**:
The sidebar action that removes every Active calendar at once, leaving the Calendar filter empty.

**Dimmed event**:
An event whose calendar is not an Active calendar while the Calendar filter is non-empty. It stays visible but greyed out and non-interactive; it is never hidden.

## Rules

- A Month swipe behaves exactly like the header arrows: it changes the Visible month and leaves the selected date untouched.
- Clicking a calendar in the sidebar toggles it in or out of the Calendar filter; no modifier key is needed.
- An empty Calendar filter means no filtering: no event is a Dimmed event.
- The Calendar filter does not affect the per-calendar event counts shown in the sidebar.
