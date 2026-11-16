import {TBlockErrorProps} from './types';

// A block that failed to load: the same rose row as the Holiday line's error, inside the block's own frame, with
// Retry. While retrying, a spinner replaces the warning mark and Retry is disabled, so the row keeps its size and the
// block doesn't jump to a skeleton and back. Not a live region, so stepping through failing days stays quiet.
const BlockError = ({message, onRetry, isRetrying = false}: TBlockErrorProps) => (
  <div className="relative flex min-h-11 items-center gap-2 border border-danger/40 bg-danger/5 pr-1 pl-2.5 text-sm text-danger">
    {isRetrying ? (
      <span
        aria-hidden
        className="size-3 shrink-0 animate-spin rounded-full border-2 border-danger/30 border-t-danger motion-reduce:animate-none"
      />
    ) : (
      <span aria-hidden className="text-xs">
        ⚠
      </span>
    )}
    <span className="min-w-0 flex-1">{message}</span>
    {isRetrying && <span className="sr-only">Retrying</span>}
    <button
      type="button"
      onClick={onRetry}
      disabled={isRetrying}
      className="min-h-11 shrink-0 cursor-pointer px-2 font-mono text-[11px] tracking-widest text-danger uppercase transition-colors hover:text-text focus-visible:text-text focus-visible:shadow-[0_0_0_1px_var(--color-danger)] focus-visible:outline-none! disabled:cursor-default disabled:opacity-50 disabled:hover:text-danger motion-reduce:transition-none">
      Retry
    </button>
  </div>
);

export default BlockError;
