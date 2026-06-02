import {useSelector} from 'react-redux';

import {useMediaQuery} from '@/hooks/useMediaQuery';
import {useOpeningItem} from '@/hooks/useOpeningItem';
import {selectIsItemCurrentlyOpened} from '@/redux/overflow/selectors';
import {cx} from '@/services/utils';

import AddEvent from './AddEvent';
import ChangeMonthControl from './ChangeMonthControl';
import ChangeViewControl from './ChangeViewControl';

const Controls = () => {
  const {ref: menuRef, refId, handleClose} = useOpeningItem();
  const isMenuOpen = useSelector(selectIsItemCurrentlyOpened(refId));

  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

  return (
    <div ref={menuRef} className="flex items-center gap-4 relative">
      {isMenuOpen && (
        <div
          onClick={e => {
            e.stopPropagation();

            handleClose();
          }}
          className="fixed w-full h-full inset-0 z-20"
        />
      )}

      <div
        className={cx('flex items-center gap-2 md:gap-4 z-20', {
          'flex flex-col border border-secondaryBackgroundColor bg-mainBackgroundColor p-4 mt-2 rounded visible':
            isMenuOpen && isMobileScreen,
        })}>
        <div
          className={cx('flex flex-row gap-[10px]', {
            'flex-col': isMenuOpen && isMobileScreen,
          })}>
          <ChangeMonthControl />
          <ChangeViewControl />
        </div>

        <div className="max-md:hidden self-stretch my-2 border-t border-s border-gray-200 dark:border-neutral-700 max-md:w-[40%] max-md:mx-auto"></div>

        <AddEvent
          showText={!isMobileScreen}
          className={cx({
            'max-md:w-8 max-md:h-8 rounded-full max-md:p-0': isMobileScreen,
          })}
        />
      </div>
    </div>
  );
};

export default Controls;
