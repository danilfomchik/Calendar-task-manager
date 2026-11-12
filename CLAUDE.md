# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- CI runs `format:check:all`, `lint:all` (`--max-warnings 0`) and `build`; `lint:file -- <path>` / `format:file -- <path>` target a single file.
- Husky pre-commit runs `lint-staged` (prettier + eslint --fix) **and a full `npm run build`**, so commits fail on any type error.
- There is no test runner configured.

## Architecture

React 18 + TypeScript + Vite SPA (calendar / event manager). Tailwind for styling, `moment` for all date handling (configured in `src/moment.config.ts`), react-hook-form + yup for forms, `@dnd-kit` for drag and drop, `motion` for animation. Import alias `@/` → `src/`.

**Routing** (`src/routes/router.tsx`, react-router v7 `createBrowserRouter`): `MainLayout` wraps `/` (month calendar, `pages/Main`) and the day route (`pages/Day`, loader validates `YYYY-MM-DD` and throws a 404 Response otherwise). Page components are re-exported from `src/pages/index.tsx`.

**State** (Redux Toolkit, `src/redux/store.ts`): slices live in per-feature folders (`events`, `date`, `overflow`, `myCalendars`, `sidebar`, `dayNotes`, `location`), each with `*Slice.ts`, `selectors.ts`, `types.ts`. Slice keys come from the `SliceNames` enum in `redux/types.ts`. `setupStore(preloadedState)` is the store factory; use `useAppDispatch` for typed dispatch.

**Persistence is via listener middleware, not the reducers.** Events are normalized as `eventsById` + `eventsByDate` (date → id list). `redux/listenersMiddleware/eventsListener.ts` writes both to `localStorage` (keys in `StorageKeys`) after `addEvent`/`editEvent`/`deleteEvent`. `dayNotesListener` (Day notes, a date → text map) and `locationListener` (the Conditions location) persist the same way; those two slices hydrate themselves from `localStorage` in their initial state. Register new listeners with `startAppListening` from `redux/listenerMiddleware.ts` and import the file in `listenersMiddleware/index.ts`. Initial hydration and the per-month per-calendar event-count map (`myCalendars`) are built in `components/layout/DataInitWrapper` from `localStorage` via `getLocalStoredValues`; keep that map in sync using `handleEventsCountChangeInMap` (`redux/myCalendars/helpers.ts`).

**Day page** (`pages/Day`, incl. AI insights via Groq and Conditions via Open-Meteo): read `docs/design/day-redesign.md` first; `docs/design/overview.md` indexes the other design docs. Domain terms in `GLOSSARY.md`; Open-Meteo rationale in `docs/adr/0001-open-meteo-for-day-conditions.md`. The Groq API (`redux/dateHolidaysGenerator/holidaysApi.tsx`) needs `VITE_REACT_APP_GROQ_API_KEY` and `VITE_REACT_APP_IS_GROQ_ENABLED` in `.env` (client-side key; don't commit real values).

**Components**: `components/common` (feature-aware reusable pieces: Modal, EventForm, MonthSmallCalendar, inputs, `formInputs/*Control` react-hook-form wrappers), `components/layout`, `components/ui` (presentational: icons, `Tooltip/NewTooltip.tsx` with `hooks/useTooltipTimers`, currently unused). Components typically sit in `Name/index.tsx` with a sibling `types.ts`.

## Conventions

Formatting (import order, quotes, bracket spacing) is enforced by Prettier. Class merging goes through `cx` from `@/services/utils` (ESLint bans importing `classnames` directly).

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
