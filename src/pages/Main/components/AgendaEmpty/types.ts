// panel: the desktop Agenda panel, whose body can hold an add button; sheet: the mobile Bottom sheet, where the
// floating + adds
export type TAgendaEmptyPlacement = 'panel' | 'sheet';

export type TAgendaEmptyProps = {
  // the selected day
  date: string;
  placement: TAgendaEmptyPlacement;
};
