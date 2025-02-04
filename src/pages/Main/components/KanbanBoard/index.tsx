import { useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useDispatch, useSelector } from "react-redux";

import Button from "@/components/Button";
import AddIcon from "@/icons/AddIcon";
import ColumnsList from "./ColumnsList";
import {
  createNewColumn,
  deleteColumn,
  reorderTasks,
  setActiveColumn,
  setActiveTask,
  setColumns,
} from "@/redux/columns/columnsSlice";
import {
  selectActiveColumn,
  selectActiveTask,
  selectAllTasks,
  selectColumns,
} from "@/redux/columns/selectors";
import { CurrentDraggableType } from "./types";
import { TId } from "@/redux/columns/types";
import DragOverlay from "./ColumnsList/DragOverlay";

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const columns = useSelector(selectColumns);
  const activeColumn = useSelector(selectActiveColumn);
  const activeTask = useSelector(selectActiveTask);
  const tasks = useSelector(selectAllTasks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px
      },
    }),
  );

  const onCreateNewColumn = () => {
    dispatch(createNewColumn());
  };

  const onClearActiveElements = useCallback(() => {
    if (activeColumn) {
      dispatch(setActiveColumn(null));
    }

    if (activeTask) {
      dispatch(setActiveTask(null));
    }
  }, [activeColumn, activeTask, dispatch]);

  const handleDragStart = (event: DragStartEvent) => {
    const { current } = event.active.data;

    if (current?.type === CurrentDraggableType.Column) {
      dispatch(setActiveColumn(current?.column));
    }

    if (current?.type === CurrentDraggableType.Task) {
      dispatch(setActiveTask(current?.task));
    }
  };

  const initDragEvent = (event: DragEndEvent | DragOverEvent) => {
    const { active, over } = event;

    const activeId = active.id;
    const overId = over ? over.id : null;

    const activeElement = active.data.current;
    const overElement = over?.data.current;

    const activeType = activeElement?.type;
    const overType = overElement?.type;

    if (!over || activeId === overId) {
      return;
    }

    return {
      activeId,
      overId,
      activeElement,
      overElement,
      activeType,
      overType,
    };
  };

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      onClearActiveElements();

      const dragEvent = initDragEvent(event);
      if (!dragEvent) return;

      const {
        activeId,
        overId,
        activeElement,
        overElement,
        activeType,
        overType,
      } = dragEvent;

      const isActiveATask = activeType === CurrentDraggableType.Task;
      const isOverAColumn = overType === CurrentDraggableType.Column;

      // moving columns
      const activeColumnIndex = columns.findIndex(
        (column) => column.id === activeId,
      );
      const overColumnIndex = columns.findIndex(
        (column) => column.id === overId,
      );

      if (isActiveATask && isOverAColumn) {
        if (activeElement?.task.columnId === overElement?.column.id) return;
      }

      dispatch(
        setColumns(arrayMove(columns, activeColumnIndex, overColumnIndex)),
      );
    },
    [columns, dispatch, onClearActiveElements],
  );

  const handleDragOver = (event: DragOverEvent) => {
    const dragEvent = initDragEvent(event);
    if (!dragEvent) return;

    const { activeId, overId, activeType, overType } = dragEvent;

    const isActiveATask = activeType === CurrentDraggableType.Task;
    const isOverATask = overType === CurrentDraggableType.Task;
    const isOverAColumn = overType === CurrentDraggableType.Column;

    if (!isActiveATask) return;

    // dropping task over another task
    if (isActiveATask && isOverATask) {
      const activeIndex = tasks.findIndex((task) => task.id === activeId);
      const overIndex = tasks.findIndex((task) => task.id === overId);

      const updatedTasks = tasks.map((task) => {
        if (task.id === activeTask?.id) {
          return {
            ...activeTask,
            columnId: tasks[overIndex].columnId,
          };
        }

        return task;
      });

      dispatch(reorderTasks(arrayMove(updatedTasks, activeIndex, overIndex)));
    }

    // dropping task over another column
    if (isActiveATask && isOverAColumn) {
      const activeIndex = tasks.findIndex((task) => task.id === activeId);

      const updatedTasks = tasks.map((task) => {
        if (task.id === activeTask?.id) {
          return {
            ...activeTask,
            columnId: overId!,
          };
        }

        return task;
      });

      dispatch(reorderTasks(arrayMove(updatedTasks, activeIndex, activeIndex)));
    }
  };

  return (
    <div className="m-auto flex min-h-screen h-screen w-full items-center overflow-x-auto px-[40px]">
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col w-full h-screen gap-8 pt-[40px] items-center">
          <Button
            icon={<AddIcon />}
            text="Add column"
            onClick={onCreateNewColumn}
          />
          <ColumnsList />
        </div>

        <DragOverlay
          activeColumn={activeColumn}
          activeTask={activeTask}
          onDeleteColumn={(columnId: TId) => {
            dispatch(deleteColumn(columnId));
          }}
        />
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
