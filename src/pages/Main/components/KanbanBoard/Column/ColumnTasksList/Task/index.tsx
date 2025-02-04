import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import Button from "@/components/Button";
import EditIcon from "@/icons/EditIcon";
import { TTasksProps } from "./types";
import DeleteIcon from "@/icons/DeleteIcon";
import { deleteTask } from "@/redux/columns/columnsSlice";
import Modal from "@/components/Modal";
import EditTaskForm from "../../EditTaskForm";

const Task = ({ task }: TTasksProps) => {
  const [isHover, setIsHover] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const dispatch = useDispatch();
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    disabled: isEditMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const isDraggingStyles = isDragging
    ? "opacity-50 border-2 border-sky-500"
    : "";

  const onDeleteTask = () => {
    dispatch(deleteTask({ taskId: task.id }));
  };

  return (
    <div
      className={`flex items-center justify-between min-h-[70px] p-3 mx-3 rounded-lg bg-columnBackgroundColor border-columnBackgroundColor border-2 cursor-grab hover:border-sky-500 ${isDraggingStyles}`}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {!isDragging && (
        <>
          <span className="overflow-hidden whitespace-nowrap text-ellipsis">
            {task.title}
          </span>
          {isHover && (
            <div className="flex gap-2">
              <Button
                className="text-sm p-1.5"
                icon={<EditIcon size="size-4" />}
                onClick={() => setIsEditMode(true)}
              />
              <Button
                className="text-sm p-1.5"
                icon={<DeleteIcon size="size-4" />}
                onClick={onDeleteTask}
              />
            </div>
          )}
        </>
      )}

      {isEditMode && (
        <Modal
          className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-columnBackgroundColor bg-opacity-80"
          onClose={() => setIsEditMode(false)}
        >
          <EditTaskForm
            task={task}
            setIsEditMode={setIsEditMode}
            setIsHover={setIsHover}
          />
        </Modal>
      )}
    </div>
  );
};

export default Task;
