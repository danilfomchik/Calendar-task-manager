# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build` (type-check is part of the build)
- `npm run lint:all` / `npm run format:check:all` — what CI runs (CI actually runs `format:all`, which writes, then `lint:all` with `--max-warnings 0`, then `build`)
- `npm run lint:file -- <path>` / `npm run format:file -- <path>` — single file
- Husky pre-commit runs `lint-staged` (prettier + eslint --fix) **and a full `npm run build`**, so commits fail on any type error.
- There is no test runner configured.

## Architecture

React 18 + TypeScript + Vite SPA (calendar / event manager). Tailwind for styling, `moment` for all date handling (configured in `src/moment.config.ts`), react-hook-form + yup for forms, `@dnd-kit` for drag and drop, `motion` for animation. Import alias `@/` → `src/`.

**Routing** (`src/routes/router.tsx`, react-router v7 `createBrowserRouter`): `MainLayout` wraps `/` (month calendar, `pages/Main`) and the day route (`pages/Day`, loader validates `YYYY-MM-DD` and throws a 404 Response otherwise). Page components are re-exported from `src/pages/index.tsx`.

**State** (Redux Toolkit, `src/redux/store.ts`): slices live in per-feature folders (`events`, `date`, `overflow`, `myCalendars`, `sidebar`, `dayNotes`, `location`), each with `*Slice.ts`, `selectors.ts`, `types.ts`. Slice keys come from the `SliceNames` enum in `redux/types.ts`. `setupStore(preloadedState)` is the store factory; use `useAppDispatch` for typed dispatch.

**Persistence is via listener middleware, not the reducers.** Events are normalized as `eventsById` + `eventsByDate` (date → id list). `redux/listenersMiddleware/eventsListener.ts` writes both to `localStorage` (keys in `StorageKeys`) after `addEvent`/`editEvent`/`deleteEvent`. `dayNotesListener` (Day notes, a date → text map) and `locationListener` (the Conditions location) persist the same way; those two slices hydrate themselves from `localStorage` in their initial state. Register new listeners with `startAppListening` from `redux/listenerMiddleware.ts` and import the file in `listenersMiddleware/index.ts`. Initial hydration and the per-month per-calendar event-count map (`myCalendars`) are built in `components/layout/DataInitWrapper` from `localStorage` via `getLocalStoredValues`; `myCalendarsSlice` keeps that map in sync itself through `extraReducers` for `addEvent`/`deleteEvent`/`editEvent` (via `handleEventsCountChangeInMap`, `redux/myCalendars/helpers.ts`), so components only dispatch the event actions.

**AI holiday info**: `redux/dateHolidaysGenerator/holidaysApi.tsx` is an RTK Query API calling the Groq chat-completions endpoint for the Day page's AI insights block (`pages/Day/components/DayContext/blocks/AIInsights`). It needs `VITE_REACT_APP_GROQ_API_KEY` and is toggled by `VITE_REACT_APP_IS_GROQ_ENABLED` in `.env` (client-side key; don't commit real values).

**Day conditions**: `redux/conditions/conditionsApi.ts` is an RTK Query API calling Open-Meteo (forecast, archive and geocoding hosts, no key) for the Conditions block, using the location from the `location` slice. See `docs/adr/0001-open-meteo-for-day-conditions.md`.

**Day page**: `pages/Day` is the redesigned page (Masthead with Week strip, Day summary, Quick add, events list, Day context drawer / Bottom sheet). Design decisions are in `docs/design/day-redesign.md`; domain terms in `GLOSSARY.md`.

**Components**: `components/common` (feature-aware reusable pieces: Modal, EventForm, MonthSmallCalendar, inputs, `formInputs/*Control` react-hook-form wrappers), `components/layout`, `components/ui` (presentational: icons, `Tooltip/NewTooltip.tsx` with `hooks/useTooltipTimers`, currently unused). Every component sits in its own `Name/index.tsx` folder, including small ones used by a single parent (nest it next to the parent, e.g. `Conditions/Fact/`). Props types are named `T<Name>Props`, exported from a sibling `types.ts`, never inlined in the signature. Only non-component modules (hooks, helpers, constants, context providers) stay flat files beside their feature.

## Conventions

Prettier config (`.prettierrc`) uses `@trivago/prettier-plugin-sort-imports`, so import order is enforced by formatting; no bracket spacing (`{foo}`), single quotes. Use `cx` from `@/services/utils` for class merging. Use `calendarColorStyle` from `@/services/styles` to expose a calendar's colour as `(--calendar-color)`. Prefer the `@/` alias over deep `../../..` imports.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
