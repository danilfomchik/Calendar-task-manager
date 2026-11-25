export type TAIInsights = {
  // region: where the holiday is observed (a country or "Worldwide"); null when the answer leaves it out
  holiday: {name: string; description: string; region: string | null} | null;
  fact: string | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown) => (typeof value === 'string' && value.trim() ? value : null);

// The model's message content is untrusted text: anything that is not the expected JSON shape yields null
// (render nothing) instead of throwing. Partial content keeps the valid half.
export const parseAIContent = (content: string | undefined): TAIInsights | null => {
  if (!content) return null;

  let raw: unknown;
  try {
    raw = JSON.parse(content);
  } catch {
    return null;
  }

  if (!isRecord(raw)) return null;

  const holidayName = isRecord(raw.holiday) ? nonEmptyString(raw.holiday.name) : null;
  const holiday =
    holidayName && isRecord(raw.holiday)
      ? {
          name: holidayName,
          description: nonEmptyString(raw.holiday.description) ?? '',
          region: nonEmptyString(raw.holiday.region)?.trim() ?? null,
        }
      : null;
  const fact = nonEmptyString(raw.fact);

  return holiday || fact ? {holiday, fact} : null;
};

const isWorldwide = (region: string) => /^(worldwide|international|global)$/i.test(region);

// "Observed in Japan" / "Observed worldwide": says whose holiday it is, since the answer is not tied to the user's country
export const describeHolidayRegion = (region: string | null) => {
  if (!region) return null;

  return isWorldwide(region) ? 'Observed worldwide' : `Observed in ${region}`;
};

// The short form for the Holiday line chip's label: "Japan" / "Worldwide"
export const shortHolidayRegion = (region: string | null) => {
  if (!region) return null;

  return isWorldwide(region) ? 'Worldwide' : region;
};
