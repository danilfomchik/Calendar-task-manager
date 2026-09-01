import classNames from 'classnames';

import Tooltip from '@/components/ui/Tooltip';
import {useEventTooltip} from '@/hooks/useEventTooltip';
import {useMediaQuery} from '@/hooks/useMediaQuery';

import {TRemainedItemsProps} from './types';

const RemainedItems = ({items}: TRemainedItemsProps) => {
  const isMobileScreen = useMediaQuery({size: 'md', direction: 'to'});

  const {isFitsContainer, onTooltipHover} = useEventTooltip();

  return (
    <Tooltip
      disabled={isMobileScreen}
      triggerElement={<span className="text-xs max-sm:text-[8px]">+{items.length}</span>}
      className="w-auto min-w-2.5 md:min-w-6.25 flex justify-end"
      contentClassName={classNames({
        'right-[1px]': !isFitsContainer,
        'left-0': isFitsContainer,
      })}
      onHover={onTooltipHover}>
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
