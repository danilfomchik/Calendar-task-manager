import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    PointerSensor,
    pointerWithin,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {arrayMove} from '@dnd-kit/sortable';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {reorderTasks, setActiveColumn, setActiveTask, setColumns} from '@/redux/columns/columnsSlice';
import {selectActiveColumn, selectActiveTask, selectAllTasks, selectColumns} from '@/redux/columns/selectors';

import DaysList from './DaysList';
import WeekDays from './WeekDays';
import {CurrentDraggableType} from './types';

// TODO: add days from prev and next month
// TODO: add mobile view

const Calendar = () => {
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

    const onClearActiveElements = useCallback(() => {
        if (activeColumn) {
            dispatch(setActiveColumn(null));
        }

        if (activeTask) {
            dispatch(setActiveTask(null));
        }
    }, [activeColumn, activeTask, dispatch]);

    const handleDragStart = (event: DragStartEvent) => {
        const {current} = event.active.data;

        if (current?.type === CurrentDraggableType.Column) {
            dispatch(setActiveColumn(current?.column));
        }

        if (current?.type === CurrentDraggableType.Task) {
            dispatch(setActiveTask(current?.task));
        }
    };

    const initDragEvent = (event: DragEndEvent | DragOverEvent) => {
        const {active, over} = event;

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

            const {activeId, overId, activeElement, overElement, activeType, overType} = dragEvent;

            const isActiveATask = activeType === CurrentDraggableType.Task;
            const isOverAColumn = overType === CurrentDraggableType.Column;

            // moving columns
            const activeColumnIndex = columns.findIndex(column => column.id === activeId);
            const overColumnIndex = columns.findIndex(column => column.id === overId);

            if (isActiveATask && isOverAColumn) {
                if (activeElement?.task.columnId === overElement?.column.id) return;
            }

            dispatch(setColumns(arrayMove(columns, activeColumnIndex, overColumnIndex)));
        },
        [columns, dispatch, onClearActiveElements],
    );

    const handleDragOver = (event: DragOverEvent) => {
        const dragEvent = initDragEvent(event);
        if (!dragEvent) return;

        const {activeId, overId, activeType, overType} = dragEvent;

        const isActiveATask = activeType === CurrentDraggableType.Task;
        const isOverATask = overType === CurrentDraggableType.Task;
        const isOverAColumn = overType === CurrentDraggableType.Column;

        if (!isActiveATask) return;

        // dropping task over another task
        if (isActiveATask && isOverATask) {
            const activeIndex = tasks.findIndex(task => task.id === activeId);
            const overIndex = tasks.findIndex(task => task.id === overId);

            const updatedTasks = tasks.map(task => {
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
            const activeIndex = tasks.findIndex(task => task.id === activeId);

            const updatedTasks = tasks.map(task => {
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
        <div className="flex flex-[4] w-full h-full items-center overflow-x-auto">
            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}>
                <div className="flex flex-col w-full h-full gap-5 items-center px-0 pt-[30px] pb-[20px]">
                    <WeekDays />
                    <DaysList />
                </div>
            </DndContext>
        </div>
    );
};

export default Calendar;
