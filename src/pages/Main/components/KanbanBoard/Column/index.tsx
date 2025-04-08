import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {useCallback, useState} from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import Button from '@/components/Button';
import Modal from '@/components/Modal';
import BoardItemForm from '@/components/forms/BoardItemForm';
import AddIcon from '@/icons/AddIcon';
import DeleteIcon from '@/icons/DeleteIcon';
import EditIcon from '@/icons/EditIcon';
import {selectTasksByColumn} from '@/redux/columns/selectors';
import {useOverflow} from '@/services/hooks';

import ColumnTasksList from './ColumnTasksList';
import EditTitleForm from './EditTitleForm';
import {TColumnProps} from './types';

const Column = ({column, onDeleteColumn}: TColumnProps) => {
    const [isTitleHover, setIsTitleHover] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const {ref, refId, isOpen, handleClose: handleModalClose, handleOpen: handleModalOpen} = useOverflow();
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

    const onAddNewTaskSubmit = useCallback(
        (data: unknown) => {
            handleModalClose();

            // eslint-disable-next-line no-console
            console.log(data);
        },
        [handleModalClose],
    );

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
                                            className="text-sm p-2"
                                            startIcon={<EditIcon size="size-5" />}
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
                                className="text-sm p-2"
                                startIcon={<DeleteIcon size="size-5" />}
                                onClick={() => onDeleteColumn(column.id)}
                            />
                        )}
                    </div>

                    <ColumnTasksList tasks={tasks} />

                    <div className="flex justify-start gap-3 p-3">
                        <div className="flex items-center px-2 py-1 text-sm rounded-md">{tasks?.length}</div>

                        <Button startIcon={<AddIcon size="size-5" />} text="Add task" onClick={handleModalOpen} />
                    </div>
                </>
            )}

            {isOpen && (
                <Modal refItem={ref} refId={refId} onClose={handleModalClose}>
                    <BoardItemForm
                        actionType="add"
                        formTitle="Create new task"
                        onSubmit={onAddNewTaskSubmit}
                        handleModalClose={handleModalClose}
                    />
                </Modal>
            )}
        </div>
    );
};

export default Column;
