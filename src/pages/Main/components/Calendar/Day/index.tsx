import {motion} from 'framer-motion';
import moment from 'moment';
import {useCallback} from 'react';
import {useSelector} from 'react-redux';

// import Button from '@/components/Button';
import Modal from '@/components/Modal';
import BoardItemForm from '@/components/forms/BoardItemForm';
// import AddIcon from '@/icons/AddIcon';
import {selectFullDate} from '@/redux/date/selectors';
import {useOpeningItem} from '@/services/hooks';
import {formatDate, getDate} from '@/services/utils';

import {TDayProps} from './types';

const Day = ({date}: TDayProps) => {
    const {ref, isOpen, handleClose: handleModalClose /*handleOpen: handleModalOpen*/} = useOpeningItem();

    const curentDate = useSelector(selectFullDate);
    const curentMonth = formatDate(moment(curentDate), 'M');
    const dateMonth = formatDate(moment(date), 'M');

    const currentDate = formatDate(getDate(new Date()), 'YYYY-MM-DD');
    const day = formatDate(getDate(date), 'DD');

    const onAddNewTaskSubmit = useCallback(
        (data: unknown) => {
            handleModalClose();

            // eslint-disable-next-line no-console
            console.log(data);
        },
        [handleModalClose],
    );

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5, ease: 'easeOut'}}
            className={`border border-secondaryBackgroundColor rounded-md p-1 md:p-3 ${dateMonth !== curentMonth ? 'bg-secondaryBackgroundColor' : ''} cursor-pointer hover:bg-secondaryBackgroundColorHover`}>
            <div className="text-xs sm:text-base">
                <span
                    className={`${currentDate === date ? 'bg-blue-600' : ''} ${dateMonth !== curentMonth ? 'text-black' : ''} rounded-full p-1 w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center text-white`}>
                    <time dateTime={date}>{day}</time>
                </span>
            </div>

            {/* <DayEventsList tasks={tasks} /> */}

            {/* <div className="flex justify-start gap-3 p-3">
                <Button startIcon={<AddIcon size="size-5" />} text="Add task" onClick={handleModalOpen} />
            </div> */}

            {isOpen && (
                <Modal refItem={ref} onClose={handleModalClose}>
                    <BoardItemForm
                        actionType="add"
                        formTitle="Create new event"
                        onSubmit={onAddNewTaskSubmit}
                        handleModalClose={handleModalClose}
                    />
                </Modal>
            )}
        </motion.div>
    );
};

export default Day;
