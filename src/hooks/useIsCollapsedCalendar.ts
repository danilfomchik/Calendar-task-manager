import {useSelector} from 'react-redux';

import {selectIsCollapsed} from '@/redux/date/selectors';

import {useMediaQuery} from './useMediaQuery';

// Collapsed calendar is mobile-only: the flag alone isn't enough on wider screens
export const useIsCollapsedCalendar = () => {
  const isCollapsed = useSelector(selectIsCollapsed);
  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

  return isCollapsed && isMobileScreen;
};
