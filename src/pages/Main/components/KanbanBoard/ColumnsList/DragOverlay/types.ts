import { TColumn, TId, TTask } from "@/redux/columns/types";
import { Nullable } from "@/services/types";

export type TColumnDragOverlayProps = {
  activeColumn: Nullable<TColumn>;
  activeTask: Nullable<TTask>;
  onDeleteColumn: (id: TId) => void;
};
