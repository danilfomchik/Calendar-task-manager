import React from "react";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import { validation } from "./form";
import Button from "@/components/Button";
import { editTask } from "@/redux/columns/columnsSlice";
import CloseIcon from "@/icons/CloseIcon";
import { TEditTaskFormProps } from "./types";
import EditIcon from "@/icons/EditIcon";

const EditTaskForm = ({
  task,
  setIsEditMode,
  setIsHover,
}: TEditTaskFormProps) => {
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(validation),
    defaultValues: { taskTitle: task.title },
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = methods;

  const onSubmit: SubmitHandler<{ taskTitle: string }> = (data) => {
    setIsEditMode(false);
    setIsHover(false);
    dispatch(
      editTask({
        taskId: task.id,
        changedValues: {
          title: data.taskTitle,
        },
      }),
    );
  };

  return (
    <div className="modal relative bg-mainBackgroundColor border border-sky-500 rounded-lg md:min-w-96 sm:min-w-56">
      <button
        className="absolute right-2 top-2 text-sm cursor-pointer hover:text-sky-500"
        onClick={() => setIsEditMode(false)}
      >
        <CloseIcon size="size-5" />
      </button>

      <h3 className="text-lg font-bold p-3 text-center">Edit task</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center justify-between gap-[20px] w-auto px-[30px] py-[20px]">
          <div className="flex flex-col gap-1 w-full">
            <input
              {...register("taskTitle")}
              autoFocus
              aria-invalid={errors.taskTitle ? "true" : "false"}
              className="bg-black w-full focus:border-sky-500 border rounded outline-none px-[15px] py-[10px]"
            />
            {errors.taskTitle && (
              <p role="alert" className="text-rose-500 text-xs">
                {errors.taskTitle.message}
              </p>
            )}
          </div>

          <Button
            className={`${
              isDirty && !errors.taskTitle && "border-sky-500 text-sky-500"
            } text-sm p-2 disabled:hover:border-columnBackgroundColor disabled:text-columnBackgroundColor disabled:hover:text-columnBackgroundColor disabled:cursor-auto`}
            disabled={!isDirty || !!errors.taskTitle}
            text="Edit"
            icon={<EditIcon size="size-5" />}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default EditTaskForm;
