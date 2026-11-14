export type TAIInsights = {
  holiday: {name: string; description: string} | null;
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
      ? {name: holidayName, description: nonEmptyString(raw.holiday.description) ?? ''}
      : null;
  const fact = nonEmptyString(raw.fact);

  return holiday || fact ? {holiday, fact} : null;
};
