import {Link} from 'react-router';

import {useDocumentTitle} from '@/hooks/useDocumentTitle';

import {TNotFoundProps} from './types';

const NotFound = ({customText}: TNotFoundProps) => {
  useDocumentTitle('Page not found');

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="flex items-center gap-3">
        <h1 className="font-headline text-numeral-l">404</h1>

        <div className="self-stretch my-2 border-t border-s border-line-strong max-md:w-[40%] max-md:mx-auto"></div>

        <p className="text-h1">Page not found {customText && `(${customText})`}</p>
      </div>

      <Link to="/" className="mt-4 text-h3 transition-colors hover:text-action">
        Return home
      </Link>
    </div>
  );
};

export default NotFound;
