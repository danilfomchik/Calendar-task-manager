import DayContextDrawer from './DayContextDrawer';
import DayContextSheet from './DayContextSheet';
import {useDayContext} from './DayContextState';
import {TDayContextProps} from './types';

// Day context: right-hand drawer from md, Bottom sheet below md (only one is mounted, so blocks never render twice)
const DayContext = ({date}: TDayContextProps) => {
  const {isMobile} = useDayContext();

  return isMobile ? <DayContextSheet date={date} /> : <DayContextDrawer date={date} />;
};

export default DayContext;
