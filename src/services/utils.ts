import classNames, {ArgumentArray} from 'classnames';
import {twMerge} from 'tailwind-merge';

import {StorageKeys} from '../types/types';

export const getLocalStoredValues = (key: StorageKeys, defaultValues?: unknown) => {
  const storedValues = localStorage.getItem(key);
  const parsedValues = storedValues ? JSON.parse(storedValues) : defaultValues;

  return parsedValues;
};

export const cx = (...args: ArgumentArray) => twMerge(classNames(...args));

// React 18's typings lack `inert`; an empty string sets the attribute, omitting it removes it
export const inertProps = (isInert: boolean) => (isInert ? ({inert: ''} as Record<string, string>) : {});
