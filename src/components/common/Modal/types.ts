import {PropsWithChildren, RefObject} from 'react';

export type TModalProps = PropsWithChildren<{
  refItem: RefObject<HTMLDivElement>;
  onClose: () => void;
  className?: string;
}>;
