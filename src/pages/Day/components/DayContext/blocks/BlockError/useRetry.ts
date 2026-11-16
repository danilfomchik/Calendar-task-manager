import {useCallback, useState} from 'react';

// Wraps a query's refetch so a block can keep showing its error row (with a spinner) while retrying, instead of
// swapping to the skeleton. Retrying lasts until the refetch settles, whatever its outcome.
export const useRetry = (refetch: () => PromiseLike<unknown>) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(() => {
    setIsRetrying(true);
    refetch().then(
      () => setIsRetrying(false),
      () => setIsRetrying(false),
    );
  }, [refetch]);

  return {isRetrying, retry};
};
