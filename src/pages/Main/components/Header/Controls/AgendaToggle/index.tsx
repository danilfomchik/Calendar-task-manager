import {useAgendaPanel} from '@/pages/Main/AgendaPanelContext';
import {AGENDA_PANEL_ID, AGENDA_TOGGLE_ID} from '@/pages/Main/constants';
import {HAIRLINE_CONTROL_BASE_CLASS} from '@/services/styles';
import {cx} from '@/services/utils';

// Shows or hides the Agenda panel (desktop only, where the panel lives), the mirror of SidebarToggle: its rail is on
// the right, where the panel appears, and is filled while the panel is shown. Always mounted, so the header never
// reflows when the panel opens or closes. A disclosure: showing the panel leaves focus here (the panel follows the
// Month grid in the tab order), and dismissing it from inside (Escape) brings focus back here.
const AgendaToggle = () => {
  const {isOpen, toggle} = useAgendaPanel();
  const label = isOpen ? 'Hide agenda' : 'Show agenda';

  return (
    <button
      type="button"
      id={AGENDA_TOGGLE_ID}
      aria-label={label}
      aria-expanded={isOpen}
      aria-controls={isOpen ? AGENDA_PANEL_ID : undefined}
      title={`${label}${isOpen ? ' (Esc)' : ''}`}
      onClick={toggle}
      className={cx(HAIRLINE_CONTROL_BASE_CLASS, 'flex size-9 shrink-0', {'text-text': isOpen})}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1.5" />
        <rect
          x="10.5"
          y="1.5"
          width="4"
          height="13"
          fill={isOpen ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
};

export default AgendaToggle;
