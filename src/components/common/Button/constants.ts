import {ButtonVariants} from './types';

export const buttonVariants = {
  [ButtonVariants.primary]:
    'border-secondary-background-color bg-mainBackgroundColor hover:border-[#3b5bfd] hover:text-[#3b5bfd]',
  [ButtonVariants.secondary]:
    'border-[#3b5bfd] bg-[#3b5bfd] hover:text-[#3b5bfd] hover:border-[#3b5bfd] hover:bg-mainBackgroundColor',
  [ButtonVariants.red]:
    'border-red-400 bg-red-400 hover:text-red-500 hover:border-red-500 hover:bg-mainBackgroundColor',
  [ButtonVariants.primaryBordered]:
    'border-secondary-background-color bg-transparent text-secondary-background-color hover:bg-secondary-background-color hover:text-white',
  [ButtonVariants.secondaryBordered]:
    'border-[#3b5bfd] text-[#3b5bfd] bg-transparent hover:bg-[#3b5bfd] hover:text-white',
  [ButtonVariants.redBordered]: 'border-red-400 text-red-400 bg-transparent hover:bg-red-400 hover:text-white',
  [ButtonVariants.transparent]: 'border-none text-[#3a3a3a] bg-transparent hover:text-white',
};
