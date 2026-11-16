import {MouseEventHandler} from 'react';

export type TRemoveButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  // False renders only the button's empty slot, so the row keeps its width
  isAvailable: boolean;
};
