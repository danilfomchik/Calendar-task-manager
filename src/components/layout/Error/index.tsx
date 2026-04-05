import {isRouteErrorResponse, useRouteError} from 'react-router';

import NotFound from '@/pages/NotFound';

const Error = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <NotFound customText={error.statusText} />;
  }

  return (
    <div className="flex justify-center h-full items-center">
      <h1 className="text-3xl font-bold">Error during page loading... Try again later!</h1>
    </div>
  );
};

export default Error;
