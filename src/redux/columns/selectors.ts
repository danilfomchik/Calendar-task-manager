import {AppStoreState} from '../store';
import {TId} from './types';

export const selectColumns = (state: AppStoreState) => state.columnsData.columns;
export const selectActiveColumn = (state: AppStoreState) => state.columnsData.activeColumn;

export const selectAllTasks = (state: AppStoreState) => state.columnsData.tasks;
export const selectTasksByColumn = (columnId: TId) => (state: AppStoreState) =>
    state.columnsData.tasks.filter(task => task.columnId === columnId);
export const selectActiveTask = (state: AppStoreState) => state.columnsData.activeTask;
