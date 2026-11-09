import {memo} from 'react';
import {useSelector} from 'react-redux';

import SidebarIcon from '@/components/ui/icons/SidebarIcon';
import {selectIsSidebarOpen} from '@/redux/sidebar/selectors';
import {onToggleSidebar} from '@/redux/sidebar/sidebarSlice';
import {useAppDispatch} from '@/redux/store';
import {cx} from '@/services/utils';

import Button from '../Button';

const OpenSidebarBtn = ({className = '', openClassName = ''}) => {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useSelector(selectIsSidebarOpen);

  const handleToggle = () => {
    dispatch(onToggleSidebar());
  };

  return (
    <Button
      className={cx('p-0 bg-transparent border-none z-60', className, {
        [openClassName]: !isSidebarOpen,
      })}
      startIcon={<SidebarIcon className="size-4" />}
      onClick={handleToggle}
    />
  );
};

export default memo(OpenSidebarBtn);
