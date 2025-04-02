import {SortableContext} from '@dnd-kit/sortable';
import {useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {deleteColumn} from '@/redux/columns/columnsSlice';
import {selectColumns} from '@/redux/columns/selectors';
import {TId} from '@/redux/columns/types';

import Column from '../Column';

const ColumnsList = () => {
    const dispatch = useDispatch();
    const columns = useSelector(selectColumns);

    const columnsIds = useMemo(() => columns.map(column => column.id), [columns]);

    const onDeleteColumn = (columnId: TId) => {
        dispatch(deleteColumn(columnId));
    };

    return (
        <div className="grid grid-cols-auto-fill gap-4 w-full">
            <SortableContext items={columnsIds}>
                {columns.map(column => (
                    <Column key={column.id} column={column} onDeleteColumn={onDeleteColumn} />
                ))}
            </SortableContext>
        </div>
    );
};

export default ColumnsList;
