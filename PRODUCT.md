# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Individuals planning their own lives. A person uses it to manage personal plans and to-dos, create events across a few
personal calendars, and open a single day to see everything about it. It is a personal tool, not a team or scheduling
product. Today it is a single-user browser app; it is meant to grow into a real product for a wider audience.

## Product Purpose

A personal calendar and planner that is more stylish and visually appealing than the default calendar apps, without
losing their everyday usefulness. Success means people choose it because it is pleasant to live in every day: planning,
capturing and reviewing their days feels considered, not utilitarian.

## Positioning

Two things set it apart from Google or Apple Calendar:

- **Style as the reason to switch.** Visual quality and a distinct look are the main promise, not a finish applied
  afterwards.
- **The day as a place.** A day is something you open and read (`/day/YYYY-MM-DD`): what it holds (events total, Calendar
  mix), what kind of day it is (AI insights, Conditions), what comes next (Upcoming) and your own words about it (Day
  note), with Quick add for fast capture.

Planned: users customise their calendar by managing theme palettes, so the look becomes personal as well as stylish.

## Operating Context

- Month view (Home) with the Month grid, an Agenda panel on desktop and a draggable Bottom sheet on mobile; the Day page
  with Masthead and Week strip, Quick add, events list and the Day context drawer or Bottom sheet.
- Used on desktop and phone browsers alike; mobile is a first-class layout (swipes, Bottom sheets, 44px targets).
- Domain vocabulary is fixed in `GLOSSARY.md`; design decisions in `docs/design/` (overview, Home, Day, typography);
  hard-to-reverse choices in `docs/adr/`.

## Capabilities and Constraints

- React 18 + TypeScript + Vite SPA, deployed on Vercel. State in Redux Toolkit; events, Day notes and location are
  persisted to `localStorage` through listener middleware. No backend or accounts yet.
- Several personal calendars, with a session-only Calendar filter that dims events rather than hiding them; totals and
  the Calendar mix ignore the filter.
- AI insights and the Holiday line come from the Groq API (client-side key, feature-flagged); Conditions use Open-Meteo
  (no key). Both are optional blocks with loading, error/Retry and disabled states.
- Calendar colour and interface colour are separate channels that never mix (calendar colour only on event marks, via
  `--calendar-color`). This matters more as colours become user-chosen.
- Planned: user-chosen calendar colours; a light theme (dark stays the default for now); user-managed theme palettes.
  Tokens are role-named so these are token changes, not rewrites.
- Undecided: the product name ("React calendar" is a placeholder); whether and when accounts, sync or a backend arrive.

## Brand Commitments

None binding yet. The name is a placeholder and will change; there is no logo beyond the favicon (`public/calendar.png`).

## Evidence on Hand

No users, testimonials, metrics or press exist. Do not invent any. Real content is the user's own events and notes in
`localStorage`; the design docs and GitHub issues (#56 Home redesign, #65 Day redesign) record the reasoning behind
shipped work.

## Product Principles

1. **Beauty is the feature.** Visual quality is the reason to choose this calendar; treat craft as product work, never
   as polish to cut.
2. **A day is a place to open.** Each day should reward visiting: what it holds, its context and the user's own notes,
   gathered in one view.
3. **Personal, and becoming personalisable.** Built for one person's life; design every colour decision so it survives
   user-chosen calendar colours, a light theme and custom palettes.
4. **Calm truth over hidden state.** Filters dim and never hide, totals always count everything, and the viewed day lives
   in the URL.
5. **Equal on phone and desktop.** Every primary action works by touch and by keyboard; nothing is hover-only.

## Accessibility & Inclusion

Baseline already in force (`docs/design/overview.md` §4): AA text contrast, meaning never carried by colour alone,
visible focus everywhere, 44px mobile targets, reduced motion respected, labelled day cells with `aria-current="date"`,
`inert` closed panels with focus return. User-chosen colours and palettes must keep these guarantees.
