import {useState} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import Button from '@/components/Button';
import DeleteIcon from '@/icons/DeleteIcon';
import {TColumnProps} from './types';
import EditIcon from '@/icons/EditIcon';
import EditTitleForm from './EditTitleForm';
import AddIcon from '@/icons/AddIcon';
import {selectTasksByColumn} from '@/redux/columns/selectors';
import ColumnTasksList from './ColumnTasksList';
import Modal from '@/components/Modal';
import NewEvent from '../../newEventForms/NewEventForm';

const Column = ({column, onDeleteColumn}: TColumnProps) => {
    const [isTitleHover, setIsTitleHover] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

    const tasks = useSelector(selectTasksByColumn(column.id), shallowEqual);
    const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
        id: column.id,
        data: {type: 'Column', column},
        disabled: isEditMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const isDraggingStyles = isDragging ? 'opacity-30 border-2 border-sky-500' : '';

    return (
        <div
            className={`flex flex-col bg-mainBackgroundColor h-[500px] max-h-[500px] rounded-md ${isDraggingStyles}`}
            style={style}
            ref={setNodeRef}>
            {!isDragging && (
                <>
                    <div
                        {...attributes}
                        {...listeners}
                        onMouseEnter={() => setIsTitleHover(true)}
                        onMouseLeave={() => setIsTitleHover(false)}
                        className="flex items-center justify-between min-h-[75px] bg-mainBackgroundColor text-xl cursor-grab rounded-md rounded-b-none p-3 font-bold border-b-2 border-secondaryBackgroundColor">
                        <div className="flex items-center gap-2">
                            {isEditMode ? (
                                <EditTitleForm
                                    column={column}
                                    onCloseEditMode={() => {
                                        setIsEditMode(false);
                                    }}
                                />
                            ) : (
                                <>
                                    {column.title}
                                    {isTitleHover && (
                                        <Button
                                            variant="primary"
                                            className="text-sm p-2"
                                            icon={<EditIcon size="size-5" />}
                                            onClick={() => {
                                                setIsEditMode(true);
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </div>

                        {!isEditMode && (
                            <Button
                                variant="primary"
                                className="text-sm p-2"
                                icon={<DeleteIcon size="size-5" />}
                                onClick={() => onDeleteColumn(column.id)}
                            />
                        )}
                    </div>

                    <ColumnTasksList tasks={tasks} />

                    <div className="flex justify-start gap-3 p-3">
                        <div className="flex items-center px-2 py-1 text-sm rounded-md">{tasks?.length}</div>

                        <Button
                            variant="primary"
                            icon={<AddIcon size="size-5" />}
                            text="Add task"
                            onClick={() => setIsCreateTaskModalOpen(true)}
                        />
                    </div>
                </>
            )}

            {isCreateTaskModalOpen && (
                <Modal onClose={() => setIsCreateTaskModalOpen(false)}>
                    <NewEvent setOpen={setIsCreateTaskModalOpen} />
                </Modal>
            )}
        </div>
    );
};

export default Column;
