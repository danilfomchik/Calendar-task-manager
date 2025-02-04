import { UniqueIdentifier } from "@dnd-kit/core";
import { PayloadAction } from "@reduxjs/toolkit";

import { Nullable } from "@/services/types";

export type TId = UniqueIdentifier;

export type TTask = {
  id: TId;
  title: string;
  columnId: TId;
};

export type TColumn = {
  id: TId;
  title: string;
};

export type TColumnsState = {
  columns: TColumn[];
  tasks: TTask[];
  activeColumn: Nullable<TColumn>;
  activeTask: Nullable<TTask>;
};

export type TSetColumnsAction = PayloadAction<TColumn[]>;
export type TSetActiveColumnAction = PayloadAction<Nullable<TColumn>>;
export type TSetActiveTaskAction = PayloadAction<Nullable<TTask>>;
export type TDeleteColumnAction = PayloadAction<TId>;
export type TSetColumnTitleAction = PayloadAction<{
  columnId: TId;
  newTitle: string;
}>;
export type TAddTaskAction = PayloadAction<TTask>;
export type TDeleteTaskAction = PayloadAction<{
  taskId: TId;
}>;
export type TEditTaskAction = PayloadAction<{
  taskId: TId;
  changedValues: Partial<TTask>;
}>;
export type TReorderTasksAction = PayloadAction<TTask[]>;
