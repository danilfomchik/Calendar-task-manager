// Two decimals is ~1.1 km of latitude: enough for a daily forecast, and it is all that leaves the browser
export const roundCoordinate = (value: number) => Math.round(value * 100) / 100;
