import AddEventButton from './AddEventButton';
import AgendaToggle from './AgendaToggle';
import ChangeMonthControl from './ChangeMonthControl';

// ‹ Today ›, the green Add event and the Agenda toggle, always in the same places: opening or closing the Agenda panel
// only flips the toggle's filled rail, so nothing in the header shifts. Add event is the page's one add action at every
// width from md (it adds to the selected day); below md the green + docked in the Bottom sheet's date row adds and there is no panel.
const Controls = () => (
  <div className="flex items-center gap-2 z-20">
    <ChangeMonthControl />

    <div className="hidden items-center gap-2 md:flex">
      <AddEventButton />
      <AgendaToggle />
    </div>
  </div>
);

export default Controls;
