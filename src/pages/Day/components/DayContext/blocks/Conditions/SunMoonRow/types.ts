import {TDayConditions} from '@/redux/conditions/types';

import {TMoonPhase} from '../moonPhase';

export type TSunMoonRowProps = {
  data: TDayConditions;
  moon: TMoonPhase;
  isSouthern: boolean;
};
