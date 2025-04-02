import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {useState} from 'react';
import {useDispatch} from 'react-redux';

import Button from '@/components/Button';
import Modal from '@/components/Modal';
import BoardItemForm from '@/components/forms/BoardItemForm';
import DeleteIcon from '@/icons/DeleteIcon';
import EditIcon from '@/icons/EditIcon';
import {deleteTask} from '@/redux/columns/columnsSlice';
import {useModal} from '@/services/hooks';

import {TTasksProps} from './types';

const Task = ({task}: TTasksProps) => {
    const [isHover, setIsHover] = useState(false);

    const dispatch = useDispatch();
    const {isOpen, handleModalClose, handleModalOpen} = useModal();
    const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
        id: task.id,
        data: {type: 'Task', task},
        disabled: isOpen,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const isDraggingStyles = isDragging ? 'opacity-50 border-2 border-sky-500' : '';

    const onDeleteTask = () => {
        dispatch(deleteTask({taskId: task.id}));
    };

    return (
        <div
            className={`flex items-center justify-between min-h-[70px] p-3 mx-3 rounded-lg bg-secondaryBackgroundColor border-secondaryBackgroundColor border-2 cursor-grab hover:border-sky-500 ${isDraggingStyles}`}
            style={style}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}>
            {!isDragging && (
                <>
                    <span className="overflow-hidden whitespace-nowrap text-ellipsis">{task.title}</span>
                    {isHover && (
                        <div className="flex gap-2">
                            <Button
                                className="text-sm p-1.5"
                                startIcon={<EditIcon size="size-4" />}
                                onClick={handleModalOpen}
                            />
                            <Button
                                className="text-sm p-1.5"
                                startIcon={<DeleteIcon size="size-4" />}
                                onClick={onDeleteTask}
                            />
                        </div>
                    )}
                </>
            )}

            {isOpen && (
                <Modal onClose={handleModalClose}>
                    <BoardItemForm
                        actionType="edit"
                        formTitle="Edit task"
                        onSubmit={() => {}}
                        handleModalClose={handleModalClose}
                    />
                </Modal>
            )}
        </div>
    );
};

export default Task;
