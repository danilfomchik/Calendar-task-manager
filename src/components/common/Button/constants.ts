import {ButtonVariants} from './types';

export const buttonVariants = {
  [ButtonVariants.primary]: 'border-line bg-surface-base hover:border-action hover:text-action',
  [ButtonVariants.secondary]:
    'border-action bg-action text-action-ink hover:text-action hover:border-action hover:bg-surface-base',
  [ButtonVariants.red]: 'border-red-400 bg-red-400 hover:text-red-500 hover:border-red-500 hover:bg-surface-base',
  [ButtonVariants.primaryBordered]: 'border-line bg-transparent text-text-muted hover:bg-line hover:text-text',
  [ButtonVariants.secondaryBordered]: 'border-action text-action bg-transparent hover:bg-action hover:text-action-ink',
  [ButtonVariants.redBordered]: 'border-red-400 text-red-400 bg-transparent hover:bg-red-400 hover:text-text',
  [ButtonVariants.transparent]: 'border-none text-text-faint bg-transparent hover:text-text',
};
