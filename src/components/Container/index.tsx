import {PropsWithChildren} from 'react';

const Container = ({className = '', children}: PropsWithChildren<{className?: string}>) => {
    return <div className={`w-full h-full max-w-[1280px] mx-auto px-[15px] md:px-[30px] ${className}`}>{children}</div>;
};

export default Container;
