import {isRouteErrorResponse, useRouteError} from 'react-router';

import {useDocumentTitle} from '@/hooks/useDocumentTitle';
import NotFound from '@/pages/NotFound';

const Error = () => {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error);
  // the same title NotFound sets for itself, so whichever effect runs last agrees
  useDocumentTitle(isNotFound ? 'Page not found' : 'Something went wrong');

  if (isNotFound) {
    return <NotFound customText={error.statusText} />;
  }

  return (
    <div className="flex justify-center h-full items-center">
      <h1 className="px-4 text-center text-h1">Error during page loading… Try again later!</h1>
    </div>
  );
};

export default Error;
