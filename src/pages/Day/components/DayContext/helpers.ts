// React 18's typings lack `inert`; an empty string sets the attribute, omitting it removes it
export const inertProps = (isInert: boolean) => (isInert ? ({inert: ''} as Record<string, string>) : {});
