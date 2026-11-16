export type TDayNoteTextProps = {
  text: string;
  // Called when the text is clicked: the parent switches to the editor. `caret` is the character offset that was
  // clicked, null when unknown (keyboard, or a click beside the text)
  onEdit: (caret: number | null) => void;
};
