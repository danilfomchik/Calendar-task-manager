# Calendar Task Manager

Glossary of domain terms used in this project.

## Language

**Visible month**:
The month the calendar is currently showing, as named in the header.

**Month grid**:
The full 6×7 view of the Visible month, including dimmed days from neighbouring months.

**Collapsed calendar**:
The mobile-only state in which the Month grid is replaced by a single Week strip.

**Week strip**:
A single Monday-first row of seven days shown in the Collapsed calendar. Days outside the Visible month are dimmed.

**Initial week**:
The week a Week strip starts on. For the current month it is the week containing today. For any other month it is the week containing the 1st.

**Week swipe**:
A horizontal gesture on the Week strip that moves to the previous or next week.

**Month swipe**:
A horizontal gesture on the Month grid, on mobile only, that moves the Visible month to the previous or next month. Only available while the Month grid is shown; in the Collapsed calendar the Week swipe applies instead.

## Rules

- A week containing the 1st of a month belongs to that month (e.g. 26 Oct – 1 Nov belongs to November), except that the week containing today always belongs to today's month (if today is 29 Oct, 26 Oct – 1 Nov belongs to October). During a Week swipe the Visible month is the month the new week belongs to.
- The selected date does not influence the Initial week.
- A Week swipe also moves the selected date by the same number of days, so the selected day keeps its weekday.
- A Month swipe behaves exactly like the header arrows: it changes the Visible month and leaves the selected date untouched.
