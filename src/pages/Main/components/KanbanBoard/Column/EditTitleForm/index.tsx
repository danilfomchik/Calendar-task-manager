import React from "react";
import { useDispatch } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@/components/Button";
import CheckIcon from "@/icons/CheckIcon";
import CloseIcon from "@/icons/CloseIcon";
import { TEditTitleFormProps, TFormValues } from "./types";
import { validation } from "./form";
import { updateColumnTitle } from "@/redux/columns/columnsSlice";

const EditTitleForm = ({ column, onCloseEditMode }: TEditTitleFormProps) => {
  const dispatch = useDispatch();
  const methods = useForm<TFormValues>({
    resolver: yupResolver(validation),
    defaultValues: {
      title: column.title,
    },
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = methods;

  const onSubmit: SubmitHandler<TFormValues> = (data) => {
    dispatch(updateColumnTitle({ columnId: column.id, newTitle: data.title }));
    onCloseEditMode();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center justify-between gap-[20px] w-auto">
        <div className="flex self-stretch my-[6px]">
          <input
            {...register("title")}
            autoFocus
            aria-invalid={errors.title ? "true" : "false"}
            className="bg-black w-full focus:border-sky-500 border rounded outline-none px-2"
          />
        </div>

        <div className="flex gap-2">
          <Button
            className="text-sm p-2 disabled:hover:border-columnBackgroundColor disabled:text-columnBackgroundColor disabled:hover:text-columnBackgroundColor disabled:cursor-auto"
            disabled={!isDirty}
            icon={<CheckIcon size="size-5" />}
            type="submit"
          />
          <Button
            className="text-sm p-2"
            icon={<CloseIcon size="size-5" />}
            onClick={onCloseEditMode}
          />
        </div>
      </div>
      {errors.title && (
        <p role="alert" className="text-rose-500 text-xs">
          {errors.title.message}
        </p>
      )}
    </form>
  );
};

export default EditTitleForm;
