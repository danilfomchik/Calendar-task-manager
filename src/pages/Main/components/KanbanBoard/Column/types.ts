import { TColumn, TId } from "@/redux/columns/types";

export type TColumnProps = {
  column: TColumn;
  onDeleteColumn: (id: TId) => void;
};
