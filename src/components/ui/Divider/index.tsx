import {ReactNode} from 'react';

import {cx} from '@/services/utils';

interface IDividerProps {
  children?: ReactNode;
  className?: string;
}

const Divider = ({className = '', children}: IDividerProps) => {
  return (
    <div
      className={cx(
        'horizontal-divider',
        {
          text: children,
        },
        className,
      )}
      role="separator"
      aria-orientation="horizontal">
      {children}
    </div>
  );
};

export default Divider;
