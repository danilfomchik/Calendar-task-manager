// Only one popover is open at a time: opening one closes whichever was open before
let closeActive: (() => void) | null = null;

export const claimActivePopover = (close: () => void) => {
  if (closeActive && closeActive !== close) closeActive();
  closeActive = close;
};

export const releaseActivePopover = (close: () => void) => {
  if (closeActive === close) closeActive = null;
};
