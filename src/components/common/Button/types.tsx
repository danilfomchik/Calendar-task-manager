import {ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode} from 'react';
import {LinkProps} from 'react-router';

import {Nullable} from '@/types/types';

export enum ButtonVariants {
  primary = 'primary',
  secondary = 'secondary',
  red = 'red',
  primaryBordered = 'primary-bordered',
  secondaryBordered = 'secondary-bordered',
  redBordered = 'red-bordered',
  transparent = 'transparent',
}

type TButtonText = string | ReactNode;

type TButton =
  | {
      startIcon?: Nullable<ReactElement> | never;
      text: TButtonText;
    }
  | {
      endIcon?: Nullable<ReactElement> | never;
      text: TButtonText;
    }
  | {
      endIcon: Nullable<ReactElement>;
      text?: TButtonText | never;
    }
  | {
      startIcon: Nullable<ReactElement>;
      text?: TButtonText | never;
    };

type TButtonKindProps = {
  kind?: 'button';
} & HTMLAttributes<HTMLButtonElement>;

export type TLinkKindProps = {
  kind: 'link';
} & LinkProps;

type TButtonKind = TButtonKindProps | TLinkKindProps;

type TButtonType = {
  variant?: `${ButtonVariants}`;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

export type TButtonProps = TButton & TButtonKind & TButtonType & ButtonHTMLAttributes<HTMLButtonElement>;
