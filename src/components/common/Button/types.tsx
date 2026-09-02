import {ButtonHTMLAttributes, HTMLAttributes, ReactElement} from 'react';
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

type TButton =
  | {
      startIcon?: Nullable<ReactElement> | never;
      text: string;
    }
  | {
      endIcon?: Nullable<ReactElement> | never;
      text: string;
    }
  | {
      endIcon: Nullable<ReactElement>;
      text?: string | never;
    }
  | {
      startIcon: Nullable<ReactElement>;
      text?: string | never;
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
