import {ButtonVariants} from './types';

export const buttonVariants = {
  [ButtonVariants.primary]:
    'border-secondaryBackgroundColor bg-mainBackgroundColor hover:border-sky-500 hover:text-sky-500',
  [ButtonVariants.secondary]:
    'border-blue-600 bg-blue-600 hover:text-sky-500 hover:border-sky-500 hover:bg-mainBackgroundColor',
  [ButtonVariants.red]:
    'border-red-400 bg-red-400 hover:text-red-500 hover:border-red-500 hover:bg-mainBackgroundColor',
  [ButtonVariants.primaryBordered]:
    'border-secondaryBackgroundColor bg-transparent text-secondaryBackgroundColor hover:bg-secondaryBackgroundColor hover:text-white',
  [ButtonVariants.secondaryBordered]: 'border-sky-500 text-sky-500 bg-transparent hover:bg-sky-500 hover:text-white',
  [ButtonVariants.redBordered]: 'border-red-400 text-red-400 bg-transparent hover:bg-red-400 hover:text-white',
  [ButtonVariants.transparent]: 'border-none text-[#3a3a3a] bg-transparent hover:text-white',
};

// export const buttonSizes = {
//   [ButtonSizes.default]: 'text-sm px-3 py-2',
//   [ButtonSizes.medium]: 'text-base px-4 py-3',
//   [ButtonSizes.small]: 'text-xs px-2 py-1',
// };
