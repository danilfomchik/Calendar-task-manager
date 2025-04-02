import {DragOverlay as DNDragOverlay} from '@dnd-kit/core';
import {createPortal} from 'react-dom';

import Column from '../../Column';
import Task from '../../Column/ColumnTasksList/Task';
import {TColumnDragOverlayProps} from './types';

const DragOverlay = ({activeColumn, activeTask, onDeleteColumn}: TColumnDragOverlayProps) => {
    return (
        <>
            {createPortal(
                <DNDragOverlay>
                    {activeColumn && <Column column={activeColumn} onDeleteColumn={onDeleteColumn} />}

                    {activeTask && <Task task={activeTask} />}
                </DNDragOverlay>,
                document.body,
            )}
        </>
    );
};

export default DragOverlay;
