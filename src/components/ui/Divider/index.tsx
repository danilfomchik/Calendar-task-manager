import classNames from 'classnames';
import {ReactNode} from 'react';

interface IDividerProps {
  children?: ReactNode;
  className?: string;
}

const Divider = ({className = '', children}: IDividerProps) => {
  return (
    <div
      className={classNames('horizontal-divider', className, {
        text: children,
      })}
      role="separator"
      aria-orientation="horizontal">
      {children}
    </div>
  );
};

export default Divider;
