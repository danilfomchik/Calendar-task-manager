import {PropsWithChildren} from 'react';

const Container = ({className = '', children}: PropsWithChildren<{className?: string}>) => {
    return <div className={`w-full max-w-[1280px] m-auto px-[15px] md:px-[30px] ${className}`}>{children}</div>;
};

export default Container;
