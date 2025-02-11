import {ButtonVariants, TButtonProps} from './types';

const buttonVariants = {
    [ButtonVariants.primary]:
        'border-secondaryBackgroundColor bg-mainBackgroundColor hover:border-sky-500 hover:text-sky-500',
    [ButtonVariants.secondary]:
        'border-blue-600 bg-blue-600 hover:text-sky-500 hover:border-sky-500 hover:bg-mainBackgroundColor',
};

const Button = ({variant, icon = null, text = '', className, children, ...restProps}: TButtonProps) => {
    return (
        <button
            className={`${buttonVariants[variant]} w-auto p-3 flex justify-center items-center gap-2 cursor-pointer border rounded-lg transition duration-500 ease-in-out disabled:hover:border-secondaryBackgroundColor disabled:text-secondaryBackgroundColor disabled:hover:text-secondaryBackgroundColor disabled:cursor-auto ${
                className ?? ''
            }`}
            {...restProps}>
            <div className={`flex items-center justify-center w-full ${icon && text ? 'gap-2' : ''}`}>
                <span className="font-normal block truncate">{icon}</span>
                <span className="font-normal block truncate">{text}</span>
            </div>

            {children}
        </button>
    );
};

export default Button;
