import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uid } from "uid";

import { SliceNames } from "../types";
import {
  TAddTaskAction,
  TColumn,
  TColumnsState,
  TDeleteColumnAction,
  TDeleteTaskAction,
  TEditTaskAction,
  TReorderTasksAction,
  TSetActiveColumnAction,
  TSetActiveTaskAction,
  TSetColumnsAction,
  TSetColumnTitleAction,
} from "./types";

const reducers = {
  setColumns: (
    state: TColumnsState,
    action: PayloadAction<TSetColumnsAction["payload"]>,
  ) => {
    state.columns = action.payload;
  },
  setActiveColumn: (
    state: TColumnsState,
    action: PayloadAction<TSetActiveColumnAction["payload"]>,
  ) => {
    state.activeColumn = action.payload;
  },
  createNewColumn: (state: TColumnsState) => {
    const newColumn: TColumn = {
      id: uid(16),
      title: `Column ${state.columns.length + 1}`,
    };

    state.columns.push(newColumn);
  },
  deleteColumn: (
    state: TColumnsState,
    action: PayloadAction<TDeleteColumnAction["payload"]>,
  ) => {
    const updatedColumns = state.columns.filter(
      (column) => column.id !== action.payload,
    );

    const updatedTasks = state.tasks.filter(
      (task) => task.columnId !== action.payload,
    );

    state.tasks = updatedTasks;
    state.columns = updatedColumns;
  },
  updateColumnTitle: (
    state: TColumnsState,
    action: PayloadAction<TSetColumnTitleAction["payload"]>,
  ) => {
    const { columnId, newTitle } = action.payload;
    const updatedColumns = state.columns.map((column) => {
      if (column.id === columnId) {
        return { ...column, title: newTitle };
      }
      return column;
    });

    state.columns = updatedColumns;
  },
  addTask: (
    state: TColumnsState,
    action: PayloadAction<TAddTaskAction["payload"]>,
  ) => {
    state.tasks.push(action.payload);
  },
  setActiveTask: (
    state: TColumnsState,
    action: PayloadAction<TSetActiveTaskAction["payload"]>,
  ) => {
    state.activeTask = action.payload;
  },
  deleteTask: (
    state: TColumnsState,
    action: PayloadAction<TDeleteTaskAction["payload"]>,
  ) => {
    const { taskId } = action.payload;

    const updatedTasks = state.tasks.filter((task) => task.id !== taskId);

    state.tasks = updatedTasks;
  },
  editTask: (
    state: TColumnsState,
    action: PayloadAction<TEditTaskAction["payload"]>,
  ) => {
    const { taskId, changedValues } = action.payload;

    const updatedTasks = state.tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, ...changedValues };
      }

      return task;
    });

    state.tasks = updatedTasks;
  },
  reorderTasks: (
    state: TColumnsState,
    action: PayloadAction<TReorderTasksAction["payload"]>,
  ) => {
    state.tasks = action.payload;
  },
};

const initialState: TColumnsState = {
  columns: [],
  tasks: [],
  activeColumn: null,
  activeTask: null,
};

const columnsSlice = createSlice({
  name: SliceNames.columnsSlice,
  initialState,
  reducers,
});

export const {
  setColumns,
  setActiveColumn,
  createNewColumn,
  deleteColumn,
  updateColumnTitle,
  addTask,
  setActiveTask,
  deleteTask,
  editTask,
  reorderTasks,
} = columnsSlice.actions;
export default columnsSlice;
