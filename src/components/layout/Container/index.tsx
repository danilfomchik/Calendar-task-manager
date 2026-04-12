import {PropsWithChildren} from 'react';

import {cx} from '@/services/utils';

const Container = ({className = '', children}: PropsWithChildren<{className?: string}>) => {
  return <div className={cx('w-full h-full max-w-[1280px] mx-auto py-[15px] px-[30px]', className)}>{children}</div>;
};

export default Container;
