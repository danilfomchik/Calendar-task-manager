import classNames, {ArgumentArray} from 'classnames';
import {twMerge} from 'tailwind-merge';

import {StorageKeys} from './types';

export const getLocalStoredValues = (key: StorageKeys, defaultValues?: unknown) => {
  const storedValues = localStorage.getItem(key);
  const parsedValues = storedValues ? JSON.parse(storedValues) : defaultValues;

  return parsedValues;
};

export const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;
};

export const cx = (...args: ArgumentArray) => twMerge(classNames(...args));
