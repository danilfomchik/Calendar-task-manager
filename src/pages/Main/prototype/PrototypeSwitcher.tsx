// PROTOTYPE: floating variant switcher. Dev only.
import {useEffect} from 'react';

import {PROTO_VARIANTS, TProtoVariant} from './useProtoVariant';

type TProps = {
  current: TProtoVariant;
  labels: Record<TProtoVariant, string>;
  onChange: (variant: TProtoVariant) => void;
};

const PrototypeSwitcher = ({current, labels, onChange}: TProps) => {
  const index = PROTO_VARIANTS.indexOf(current);

  const cycle = (step: number) => {
    onChange(PROTO_VARIANTS[(index + step + PROTO_VARIANTS.length) % PROTO_VARIANTS.length]);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;

      onChange(
        PROTO_VARIANTS[
          (PROTO_VARIANTS.indexOf(current) + (e.key === 'ArrowRight' ? 1 : -1) + PROTO_VARIANTS.length) %
            PROTO_VARIANTS.length
        ],
      );
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [current, onChange]);

  if (import.meta.env.PROD) return null;

  return (
    <div
      role="group"
      aria-label="Prototype variant"
      className="fixed bottom-3 left-1/2 z-100 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white p-1 text-black shadow-[0_6px_24px_rgba(0,0,0,0.6)]">
      <button
        type="button"
        aria-label="Previous variant"
        onClick={() => cycle(-1)}
        className="size-8 cursor-pointer rounded-full text-lg leading-none hover:bg-black/10">
        ‹
      </button>
      <span className="min-w-44 px-1 text-center font-mono text-xs font-semibold">
        {current === '0' ? '0' : current} · {labels[current]}
      </span>
      <button
        type="button"
        aria-label="Next variant"
        onClick={() => cycle(1)}
        className="size-8 cursor-pointer rounded-full text-lg leading-none hover:bg-black/10">
        ›
      </button>
    </div>
  );
};

export default PrototypeSwitcher;
