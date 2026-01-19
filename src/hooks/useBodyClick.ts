import {useCallback, useEffect, useRef} from 'react';

export const useBodyClick = ({
  refId,
  isOpen,
  onClick,
}: {
  refId: string;
  isOpen: boolean;
  onClick: (refId: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const onBodyClick = useCallback(
    (event: MouseEvent) => {
      if (ref.current?.contains(event.target as Node)) {
        return;
      }

      if (isOpen) {
        onClick(refId);
      }
    },
    [onClick, refId, isOpen],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      document.body.addEventListener('click', onBodyClick);
    }, 0);

    return () => {
      clearTimeout(timeout);
      document.body.removeEventListener('click', onBodyClick);
    };
  }, [onBodyClick]);

  return {ref};
};
