import {ButtonHTMLAttributes, ReactElement} from 'react';

import {Nullable} from '@/services/types';

export enum ButtonVariants {
    primary = 'primary',
    secondary = 'secondary',
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

type TButtonType = {
    variant?: `${ButtonVariants}`;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
};

export type TButtonProps = TButton & TButtonType & ButtonHTMLAttributes<HTMLButtonElement>;
