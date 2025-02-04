import React from "react";
import { createPortal } from "react-dom";
import { DragOverlay as DNDragOverlay } from "@dnd-kit/core";

import Column from "../../Column";
import { TColumnDragOverlayProps } from "./types";
import Task from "../../Column/ColumnTasksList/Task";

const DragOverlay = ({
  activeColumn,
  activeTask,
  onDeleteColumn,
}: TColumnDragOverlayProps) => {
  return (
    <>
      {createPortal(
        <DNDragOverlay>
          {activeColumn && (
            <Column column={activeColumn} onDeleteColumn={onDeleteColumn} />
          )}

          {activeTask && <Task task={activeTask} />}
        </DNDragOverlay>,
        document.body,
      )}
    </>
  );
};

export default DragOverlay;
