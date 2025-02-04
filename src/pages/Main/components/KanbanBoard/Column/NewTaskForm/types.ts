import {Dispatch} from 'react';

import {TId} from '@/redux/columns/types';

export type TNewTaskFormProps = {
    columnId: TId;
    setIsCreateTaskModalOpen: Dispatch<React.SetStateAction<boolean>>;
};
