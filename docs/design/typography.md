# Typography

Two families with separate jobs, both from Google Fonts (`index.html`). No monospace face and no `text-transform`
anywhere. Body text defaults to Paragraph M (set on `#root`).

- **Inter Tight** (400/500/600/700, `font-display`, the default): every text size, the Month grid and mini-calendar
  numerals included.
- **Big Shoulders Display** (500/800, `font-headline`): the Headline voice, a condensed signage grotesk with the figures
  of a tear-off wall calendar. Only at display sizes, 32px and up, and only for the month title, the hero day numerals
  and the events total. Nothing at text sizes uses it. The one step below 32px is the month title on narrow phones,
  which scales down to 26px so it fits beside the month controls (see `text-title`).

Each style is a Tailwind font-size token in `src/index.css` (`--text-<style>` plus `--line-height`, `--font-weight`
and `--letter-spacing`), so one class (`text-h4`, `text-caption`) sets all four. A `leading-*`, `tracking-*` or
`font-<weight>` class beside it overrides that part; only do that on purpose (e.g. `leading-none` in the fixed-height
month-grid event rows). The tokens are registered with tailwind-merge in `cx` (`src/services/utils.ts`), so add any new
token there too.

The table gives the spec's pixels. In the tokens, line height is unitless (line height ÷ size, e.g. `1.43` for 20/14) and
letter spacing is in `em` (e.g. `0.015em` for +0.21px at 14px), so both scale with the size and nothing inherits a fixed
value.

Text inputs are `text-para-m md:text-para-s` at the smallest: iOS Safari zooms the page when an input's text is under
16px. Text that turns into an input (the Day note) uses the same pair so it doesn't jump when edited.

| Class          | Size | Line height | Weight | Letter spacing | Used for                                            |
| -------------- | ---- | ----------- | ------ | -------------- | --------------------------------------------------- |
| `text-h1`      | 34   | 40          | 700    | -0.34px        | page titles (error page)                            |
| `text-h2`      | 28   | 34          | 700    | -0.28px        | featured title (AI insight hero), temperature       |
| `text-h3`      | 24   | 30          | 600    | -0.12px        | section header                                      |
| `text-h4`      | 20   | 26          | 600    | 0              | secondary header (weekday in Day heading, app name) |
| `text-h5`      | 18   | 24          | 600    | 0              | event title in lists                                |
| `text-h6`      | 16   | 22          | 600    | +0.08px        | date numbers (week strip, month grid), small heads  |
| `text-para-l`  | 18   | 28          | 400    | +0.09px        | summary / pull quote                                |
| `text-para-m`  | 16   | 24          | 400    | +0.16px        | default body, event descriptions, inputs            |
| `text-para-s`  | 14   | 20          | 400    | +0.21px        | times, button labels, secondary lines               |
| `text-caption` | 12   | 16          | 500    | +0.36px        | weekday labels, event meta, block eyebrows, badges  |

The spec is written for mobile; from `md` some elements step up the same scale (week strip numbers `text-h6` →
`md:text-h3`, month grid numbers `text-h6` → `md:text-h4`).

Month grid numerals (Home and the sidebar mini-calendar) have no leading zero. Their weight is a deliberate override
that carries the day's load: `font-bold` on a day with events, `font-normal` on an empty one, and `font-normal` in
`text-text-faint` for a neighbouring month's day. The mini-calendar keeps its numerals at `text-caption` to fit the
210px sidebar (with the same weight rule, plus its event dot); only the Home Month grid uses `text-h6` / `md:text-h4`.

## Headline styles

Three tiers of numbers, one per voice, so no two compete: the **hero numeral** (Headline, 50–96px) names the day, the
**figure** (Headline, 32px) counts it, and the **grid numerals** (Inter Tight, 16–20px, weight carries load) are data.
Each Headline class sets size, line height, weight and tracking; pair it with `font-headline`.

| Class             | Size          | Line height | Weight | Used for                                                         |
| ----------------- | ------------- | ----------- | ------ | ---------------------------------------------------------------- |
| `text-title`      | 44 (26–32 sm) | 1.3         | 800    | Home month title; the year is weight 500 at 60% opacity          |
| `text-figure`     | 32            | 0.94        | 800    | events total ("12 events", "Free day" muted), 30px line box      |
| `text-numeral-s`  | 50            | 0.82        | 800    | Viewed day cell on mobile (the strip is 112px high)              |
| `text-numeral-m`  | 56            | 0.82        | 800    | Day heading in the mobile Bottom sheet                           |
| `text-numeral-l`  | 68            | 0.82        | 800    | Viewed day cell from `md`, the 404                               |
| `text-numeral-xl` | 96            | 0.82        | 800    | Day heading in the desktop Agenda panel, the one hero that grows |

Line height 0.82 hugs Big Shoulders' digits (0.81em tall), so a numeral sits on its row's baseline. The s/m/l sizes
keep the line boxes of the Inter Tight numerals they replaced (and the figure keeps `text-h3`'s 30px), so the Bottom
sheet's peek budget and the Week strip's height are unchanged. Big Shoulders has no tabular figures; its digits are
near-equal width apart from 1 and 7, so the weekday beside a numeral barely moves between days.

Tracking is 0 on every Headline class except `text-figure`, which is +0.005em.

On mobile the Viewed day cell has room for one line under the numeral: "Today" when the Viewed day is today, otherwise
"Nov 2026". Its weekday is `text-h6 leading-none`, a deliberate override like the month-grid rows.

Fallback: each family has a metric fallback. `--font-display` lists `'Inter Tight Fallback'`, an `@font-face` over local Arial with `size-adjust`,
`ascent-override` and `descent-override` measured from Inter Tight 400, so text set before the web font arrives takes the
same width and line box and the swap doesn't reflow. `--font-headline` lists `'Big Shoulders Fallback'`, the same over
local Arial Bold, measured from Big Shoulders Display 800; it declares `font-weight: 100 900` so the browser doesn't
synthesise bold on top of an already bold face. Re-measure if a family or its version changes.

The spec's colours (#111418 / #3B414C / #5B6270 / #2F5BEA) are for a light surface; the app is dark-only, so text keeps
the `text-text` / `text-text-muted` / `text-text-faint` roles.
