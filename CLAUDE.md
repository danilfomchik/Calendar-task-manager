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

**State** (Redux Toolkit, `src/redux/store.ts`): slices live in per-feature folders (`events`, `date`, `overflow`, `myCalendars`, `sidebar`), each with `*Slice.ts`, `selectors.ts`, `types.ts`. Slice keys come from the `SliceNames` enum in `redux/types.ts`. `setupStore(preloadedState)` is the store factory; use `useAppDispatch` for typed dispatch.

**Persistence is via listener middleware, not the reducers.** Events are normalized as `eventsById` + `eventsByDate` (date → id list). `redux/listenersMiddleware/eventsListener.ts` writes both to `localStorage` (keys in `StorageKeys`) after `addEvent`/`editEvent`/`deleteEvent`, resetting `isDisabled` on the way out. Register new listeners with `startAppListening` from `redux/listenerMiddleware.ts` and import the file in `listenersMiddleware/index.ts`. Initial hydration and the per-month per-calendar event-count map (`myCalendars`) are built in `components/layout/DataInitWrapper` from `localStorage` via `getLocalStoredValues`; keep that map in sync using `handleEventsCountChangeInMap` (`redux/myCalendars/helpers.ts`).

**AI holiday info**: `redux/dateHolidaysGenerator/holidaysApi.tsx` is an RTK Query API calling the Groq chat-completions endpoint for the Day page (`pages/Day/components/AIInfo`). It needs `VITE_REACT_APP_GROQ_API_KEY` and is toggled by `VITE_REACT_APP_IS_GROQ_ENABLED` in `.env` (client-side key; don't commit real values).

**Components**: `components/common` (feature-aware reusable pieces: Modal, EventForm, EventsList, inputs, `formInputs/*Control` react-hook-form wrappers), `components/layout`, `components/ui` (presentational: icons, Tooltip, Divider). Components typically sit in `Name/index.tsx` with a sibling `types.ts`. Tooltip is mid-refactor on this branch: `ui/Tooltip/NewTooltip.tsx` (uses `hooks/useTooltipTimers`) coexists with the older `ui/Tooltip/index.tsx`.

## Conventions

Prettier config (`.prettierrc`) uses `@trivago/prettier-plugin-sort-imports`, so import order is enforced by formatting; no bracket spacing (`{foo}`), single quotes. Use `cx` from `@/services/utils` for class merging.
