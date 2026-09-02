import {PropsWithChildren} from 'react';

import {cx} from '@/services/utils';

const Container = ({className = '', children}: PropsWithChildren<{className?: string}>) => {
  return <div className={cx('w-full h-full max-w-7xl mx-auto py-3.75 px-7.5', className)}>{children}</div>;
};

export default Container;
