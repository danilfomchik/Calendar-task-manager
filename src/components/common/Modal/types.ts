import {PropsWithChildren, RefObject} from 'react';

export type TModalProps = PropsWithChildren<{
  refItem: RefObject<HTMLDivElement>;
  onClose: () => void;
  // id of the element that names the dialog (its heading)
  labelledBy?: string;
  className?: string;
}>;
