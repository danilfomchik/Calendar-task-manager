import {TButtonProps} from './types';
import {buttonVariants} from './variants';

const Button = ({
    variant = 'primary',
    startIcon = null,
    endIcon = null,
    text = '',
    className,
    children,
    ...restProps
}: TButtonProps) => {
    return (
        <button
            className={`${buttonVariants[variant]} w-auto p-3 flex justify-center items-center gap-2 cursor-pointer border rounded-lg transition duration-500 ease-in-out disabled:hover:border-secondaryBackgroundColor disabled:text-secondaryBackgroundColor disabled:hover:text-secondaryBackgroundColor disabled:cursor-auto ${
                className ?? ''
            }`}
            {...restProps}>
            <div className={`flex items-center justify-center w-full ${(startIcon || endIcon) && text ? 'gap-2' : ''}`}>
                {startIcon ? <span className="font-normal block truncate">{startIcon}</span> : null}

                <span className="font-normal block truncate">{text}</span>

                {endIcon ? <span className="font-normal block truncate">{endIcon}</span> : null}
            </div>

            {children}
        </button>
    );
};

export default Button;
