import {SortableContext} from '@dnd-kit/sortable';
import {useMemo} from 'react';

import Task from './Event';
import {TColumnTasksListProps} from './types';

const ColumnTasksList = ({tasks}: TColumnTasksListProps) => {
    const tasksIds = useMemo(() => tasks.map(task => task.id), [tasks]);

    return (
        <div className="flex flex-nowrap flex-col flex-grow overflow-auto gap-2 py-3 border-b border-secondaryBackgroundColor">
            <SortableContext items={tasksIds}>
                {tasks.map(task => (
                    <Task key={task.id} task={task} />
                ))}
            </SortableContext>
        </div>
    );
};

export default ColumnTasksList;
