import {cx} from '@/services/utils';

const SHORTCUTS = [
  {keys: ['←', '→'], label: 'Day', title: 'Previous / next day'},
  {keys: ['T'], label: 'Today', title: 'Go to today'},
  {keys: ['N'], label: 'New event', title: 'Add an event on this day'},
];

const Kbd = ({children}: {children: string}) => (
  <kbd className="inline-flex h-5 min-w-5 items-center justify-center border border-line-strong bg-surface-sunken px-1 font-mono text-[10px] text-text-muted">
    {children}
  </kbd>
);

// Discreet list of the Day page keyboard shortcuts. Desktop only, like the shortcuts themselves (useDayShortcuts).
const ShortcutsHint = ({className}: {className?: string}) => (
  <section aria-label="Keyboard shortcuts" className={cx('max-md:hidden', className)}>
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] tracking-wider text-text-faint uppercase">
      {SHORTCUTS.map(({keys, label, title}) => (
        <li key={label} title={title} className="flex items-center gap-1.5">
          {keys.map(key => (
            <Kbd key={key}>{key}</Kbd>
          ))}
          <span>{label}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default ShortcutsHint;
