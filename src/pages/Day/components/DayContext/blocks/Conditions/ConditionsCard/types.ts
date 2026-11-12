import {TConditionsSource} from '@/redux/conditions/types';
import {TLocation} from '@/redux/location/types';

export type TConditionsCardProps = {
  date: string;
  location: TLocation;
  source: TConditionsSource;
  isApproximate: boolean;
  onChangeLocation: () => void;
  focusChange: boolean;
};
