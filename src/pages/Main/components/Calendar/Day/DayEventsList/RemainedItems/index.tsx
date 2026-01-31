import Tooltip from '@/components/Tooltip';
import {useScreenSize} from '@/hooks/useScreenSize';

import {TRemainedItemsProps} from './types';

const RemainedItems = ({items}: TRemainedItemsProps) => {
  const screenSize = useScreenSize();

  const isMobileScreen = screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md';

  return (
    <Tooltip
      disabled={isMobileScreen}
      triggerElement={<span className="text-xs max-sm:text-[10px]">+{items.length}</span>}
      className="w-auto min-w-[25px] flex justify-end">
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
