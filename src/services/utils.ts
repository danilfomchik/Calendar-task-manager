import classNames, {ArgumentArray} from 'classnames';
import {twMerge} from 'tailwind-merge';

import {StorageKeys} from './types';

export const getLocalStoredValues = (key: StorageKeys, defaultValues?: unknown) => {
  const storedValues = localStorage.getItem(key);
  const parsedValues = storedValues ? JSON.parse(storedValues) : defaultValues;

  return parsedValues;
};

export const cx = (...args: ArgumentArray) => twMerge(classNames(...args));
