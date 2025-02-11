import {ButtonHTMLAttributes, ReactElement} from 'react';

import {Nullable} from '@/services/types';

export enum ButtonVariants {
    primary = 'primary',
    secondary = 'secondary',
}

type TButton =
    | {
          icon?: Nullable<ReactElement> | never;
          text: string;
      }
    | {
          icon: Nullable<ReactElement>;
          text?: string | never;
      };

type TButtonType = {variant: `${ButtonVariants}`};

export type TButtonProps = TButton & TButtonType & ButtonHTMLAttributes<HTMLButtonElement>;
