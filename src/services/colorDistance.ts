// Keeps calendar colours apart from the interface channels (docs/design/overview.md, "Two colour channels").
// Distance is ΔEOK: straight-line distance in OKLab, where 0 is identical and ~0.02 is barely noticeable.

type TOklab = [l: number, a: number, b: number];

// Mirrors the `@theme` tokens in src/index.css. Calendar colours must stay at least
// MIN_CALENDAR_INTERFACE_DELTA_E away from each of these. `assertCalendarColorsAreDistinct` checks the mirror in dev.
const RESERVED_INTERFACE_COLORS = {
  action: '#35e08a',
  info: '#5aa2ff',
  danger: '#fb7185',
} as const;

// The old Work blue (#4a6cf7) sat 0.139 from info and still read as "today", so the floor sits just above that.
const MIN_CALENDAR_INTERFACE_DELTA_E = 0.15;

const HEX_COLOR_RE = /^#([0-9a-f]{6})$/i;

const toLinear = (channel: number) => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

// `#rrggbb` → OKLab (Björn Ottosson's matrices); null for anything else
const hexToOklab = (hex: string): TOklab | null => {
  const match = HEX_COLOR_RE.exec(hex.trim());
  if (!match) return null;

  const value = parseInt(match[1], 16);
  const r = toLinear((value >> 16) & 255);
  const g = toLinear((value >> 8) & 255);
  const b = toLinear(value & 255);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

// ΔEOK between two `#rrggbb` colours; NaN if either can't be parsed
const deltaEOK = (first: string, second: string): number => {
  const a = hexToOklab(first);
  const b = hexToOklab(second);
  if (!a || !b) return NaN;

  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
};

type TInterfaceColorCollision = {
  channel: keyof typeof RESERVED_INTERFACE_COLORS;
  distance: number;
};

// The interface channels a candidate calendar colour is too close to (empty = safe to use).
// An unparseable colour collides with every channel, so a user-picked value can't slip through.
const getInterfaceColorCollisions = (color: string): TInterfaceColorCollision[] =>
  (Object.keys(RESERVED_INTERFACE_COLORS) as (keyof typeof RESERVED_INTERFACE_COLORS)[])
    .map(channel => ({channel, distance: deltaEOK(color, RESERVED_INTERFACE_COLORS[channel])}))
    .filter(({distance}) => !(distance >= MIN_CALENDAR_INTERFACE_DELTA_E));

export const isCalendarColorAllowed = (color: string) => getInterfaceColorCollisions(color).length === 0;

// Dev-only assertion: throws when a calendar colour drifts into an interface channel, or when the mirror above no
// longer matches the CSS tokens it copies. Both are code mistakes, so failing loudly in dev is the point.
export const assertCalendarColorsAreDistinct = (calendars: {name: string; itemColor: string}[]) => {
  const rootStyle = getComputedStyle(document.documentElement);
  const problems: string[] = [];

  for (const [channel, hex] of Object.entries(RESERVED_INTERFACE_COLORS)) {
    const token = rootStyle.getPropertyValue(`--color-${channel}`).trim().toLowerCase();
    if (token && token !== hex)
      problems.push(`--color-${channel} is ${token} but RESERVED_INTERFACE_COLORS has ${hex}`);
  }

  for (const {name, itemColor} of calendars) {
    for (const {channel, distance} of getInterfaceColorCollisions(itemColor)) {
      problems.push(
        `${name} (${itemColor}) is ${distance.toFixed(3)} ΔEOK from ${channel}; keep it at least ${MIN_CALENDAR_INTERFACE_DELTA_E} away`,
      );
    }
  }

  if (problems.length) throw new Error(`[calendar colours]\n${problems.join('\n')}`);
};
