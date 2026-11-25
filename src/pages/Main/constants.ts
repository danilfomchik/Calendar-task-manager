// Shared by the Agenda panel, its header toggle and AgendaPanelContext's focus handoff.

// The Agenda panel's region, which the Agenda toggle controls (aria-controls)
export const AGENDA_PANEL_ID = 'agenda-panel';

// The Agenda toggle itself: dismissing the panel while focus is inside it hands focus here, since the panel unmounts
export const AGENDA_TOGGLE_ID = 'agenda-toggle';
