import {Link} from 'react-router';

import {cx} from '@/services/utils';

import {buttonVariants} from './constants';
import {TButtonProps, TLinkKindProps} from './types';

const Button = ({
  variant = 'primary',
  kind = 'button',
  startIcon = null,
  endIcon = null,
  text = '',
  className = '',
  children,
  ...restProps
}: TButtonProps) => {
  const btnContent = (
    <button
      className={cx(
        'w-auto p-3 flex justify-center items-center gap-2 cursor-pointer border rounded-lg transition duration-500 ease-in-out disabled:hover:border-secondaryBackgroundColor disabled:text-secondaryBackgroundColor disabled:hover:text-secondaryBackgroundColor disabled:cursor-auto',
        buttonVariants[variant],
        className,
      )}
      {...restProps}>
      <div
        className={cx('flex items-center justify-center w-full', {
          'gap-2': (startIcon || endIcon) && text,
        })}>
        {startIcon ? <span className="font-medium block truncate">{startIcon}</span> : null}

        <span className="font-medium block truncate">{text}</span>

        {endIcon ? <span className="font-medium block truncate">{endIcon}</span> : null}
      </div>

      {children}
    </button>
  );

  if (kind === 'link') {
    const {to, ...linkProps} = restProps as TLinkKindProps;

    return (
      <Link to={to} {...linkProps}>
        {btnContent}
      </Link>
    );
  }

  return btnContent;
};

export default Button;
