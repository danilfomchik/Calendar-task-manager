import classNames, {ArgumentArray} from 'classnames';
import {extendTailwindMerge} from 'tailwind-merge';

// The type scale's `text-<style>` tokens (index.css) are font sizes; unregistered, tailwind-merge would read them as
// text colours and drop one of `text-para-s text-text-muted`
// The elevation `shadow-<role>` tokens likewise, which it would otherwise read as shadow colours
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [{shadow: ['sheet', 'modal', 'popover', 'dropdown', 'fab', 'float', 'band']}],
      'font-size': [
        {
          text: [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'para-l',
            'para-m',
            'para-s',
            'caption',
            'title',
            'figure',
            'numeral-s',
            'numeral-m',
            'numeral-l',
            'numeral-xl',
          ],
        },
      ],
    },
  },
});

export const cx = (...args: ArgumentArray) => twMerge(classNames(...args));
