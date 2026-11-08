// PROTOTYPE: variant lives in `?variant=`, mirrored to sessionStorage because the
// existing mobile Day cell calls setSearchParams() and would otherwise wipe it.
import {useCallback, useEffect} from 'react';
import {useSearchParams} from 'react-router';

export const PROTO_VARIANTS = ['0', 'A'] as const;
export type TProtoVariant = (typeof PROTO_VARIANTS)[number];

const DEFAULT_VARIANT: TProtoVariant = 'A';
const STORAGE_KEY = 'proto-home-variant';

const isVariant = (value: string | null): value is TProtoVariant =>
  !!value && (PROTO_VARIANTS as readonly string[]).includes(value);

const readStored = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const useProtoVariant = () => {
  const [params, setParams] = useSearchParams();
  const raw = params.get('variant');
  const stored = readStored();

  const variant: TProtoVariant = isVariant(raw) ? raw : isVariant(stored) ? stored : DEFAULT_VARIANT;

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, variant);
    } catch {
      // ignore
    }
  }, [variant]);

  const setVariant = useCallback(
    (next: TProtoVariant) => {
      setParams(
        prev => {
          const nextParams = new URLSearchParams(prev);
          nextParams.set('variant', next);
          return nextParams;
        },
        {replace: true},
      );
    },
    [setParams],
  );

  return {variant, setVariant};
};

// PROTOTYPE: sidebar restyle follows the variant (variant 0 = current sidebar)
export const useRedesign = () => {
  const {variant} = useProtoVariant();
  return !import.meta.env.PROD && variant !== '0';
};
