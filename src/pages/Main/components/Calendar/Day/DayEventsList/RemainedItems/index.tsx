import Tooltip from '@/components/Tooltip';

import {TRemainedItemsProps} from './types';

const RemainedItems = ({items}: TRemainedItemsProps) => {
    return (
        <Tooltip
            triggerElement={<span className="text-xs max-sm:text-[10px]">+{items.length}</span>}
            className="w-auto flex justify-end">
            <div className="flex flex-col">
                {items.map(item => (
                    <div key={item.id} className="whitespace-nowrap text-ellipsis overflow-hidden">
                        {item.title}
                    </div>
                ))}
            </div>
        </Tooltip>
    );
};

export default RemainedItems;
