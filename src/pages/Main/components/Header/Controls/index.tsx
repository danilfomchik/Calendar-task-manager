import {useSelector} from 'react-redux';

import {useMediaQuery} from '@/hooks/useMediaQuery';
import {useOpeningItem} from '@/hooks/useOpeningItem';
import {selectIsItemCurrentlyOpened} from '@/redux/overflow/selectors';
import {cx} from '@/services/utils';

import AddEventButton from './AddEventButton';
import ChangeMonthControl from './ChangeMonthControl';

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
          'flex flex-col border border-line bg-surface-base p-4 mt-2 rounded visible': isMenuOpen && isMobileScreen,
        })}>
        <div
          className={cx('flex flex-row gap-2.5', {
            'flex-col': isMenuOpen && isMobileScreen,
          })}>
          <ChangeMonthControl />
        </div>

        {/* on mobile the Bottom sheet's floating button adds events */}
        {!isMobileScreen && <AddEventButton />}
      </div>
    </div>
  );
};

export default Controls;
