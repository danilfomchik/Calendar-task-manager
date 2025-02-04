import React from "react";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { uid } from "uid";

import { validation, defaultValues } from "./form";
import CheckIcon from "@/icons/CheckIcon";
import Button from "@/components/Button";
import { addTask } from "@/redux/columns/columnsSlice";
import CloseIcon from "@/icons/CloseIcon";
import { TNewTaskFormProps } from "./types";

const NewTaskForm = ({
  columnId,
  setIsCreateTaskModalOpen,
}: TNewTaskFormProps) => {
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(validation),
    defaultValues,
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = methods;

  const onSubmit: SubmitHandler<typeof defaultValues> = (newTask) => {
    setIsCreateTaskModalOpen(false);

    dispatch(
      addTask({
        id: uid(),
        title: newTask.taskTitle,
        columnId: columnId,
      }),
    );
  };

  return (
    <div className="modal relative bg-mainBackgroundColor border border-sky-500 rounded-lg md:min-w-96 sm:min-w-56">
      <button
        className="absolute right-2 top-2 text-sm cursor-pointer hover:text-sky-500"
        onClick={() => setIsCreateTaskModalOpen(false)}
      >
        <CloseIcon size="size-5" />
      </button>

      <h3 className="text-lg font-bold p-3 text-center">Create new task</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center justify-between gap-[20px] w-auto px-[30px] py-[20px]">
          <input
            {...register("taskTitle")}
            autoFocus
            aria-invalid={errors.taskTitle ? "true" : "false"}
            className="bg-black w-full focus:border-sky-500 border rounded outline-none px-[15px] py-[10px]"
          />

          <Button
            className={`${
              isDirty && "border-sky-500 text-sky-500"
            } text-sm p-2 disabled:hover:border-columnBackgroundColor disabled:text-columnBackgroundColor disabled:hover:text-columnBackgroundColor disabled:cursor-auto`}
            disabled={!isDirty}
            text="Create task"
            icon={<CheckIcon size="size-5" />}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default NewTaskForm;
