import {useEffect} from 'react';

import VerticalDots from '@/icons/VerticalDots';
import ChangeMonthControl from '../CalendarDateControls/ChangeMonthControl';
import ChangeViewControl from '../CalendarDateControls/ChangeViewControl';
import AddEvent from '../AddEvent';
import Button from '@/components/Button';
import {useBodyClick, useScreenSize} from '@/services/hooks';

const Controls = () => {
    const screenSize = useScreenSize();
    const {ref: menuRef, isOpen: isMenuOpen, setIsOpen: setIsMenuOpen} = useBodyClick();

    const isMobileScreen = screenSize === 'xs' || screenSize === 'sm';

    useEffect(() => {
        if (!isMobileScreen) {
            setIsMenuOpen(false);
        }
    }, [isMobileScreen, setIsMenuOpen]);

    return (
        <div ref={menuRef} className="flex items-center gap-4 relative">
            <div className="md:hidden">
                <Button
                    variant="primary"
                    icon={<VerticalDots size="size-6" />}
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    className="text-sm p-[8px]"
                />
            </div>

            <div
                className={`${isMenuOpen && isMobileScreen ? 'flex flex-col border border-secondaryBackgroundColor bg-mainBackgroundColor p-4 mt-2 rounded' : 'hidden'} top-10 right-0 items-center gap-2 md:flex max-md:absolute md:gap-4`}>
                <div className={`flex ${isMenuOpen && isMobileScreen ? 'flex-col' : 'flex-row'} gap-[10px]`}>
                    <ChangeMonthControl />
                    <ChangeViewControl />
                </div>

                <div className="self-stretch my-2 border-t border-s border-gray-200 dark:border-neutral-700 max-md:w-[40%] max-md:mx-auto"></div>

                <AddEvent />
            </div>
        </div>
    );
};

export default Controls;
