import {TGeolocationFailure, TGeolocationStatus} from '@/redux/location/types';

import {TLocationTriggerProps} from '../types';

export type TSetLocationPromptProps = TLocationTriggerProps & {
  geolocationStatus: TGeolocationStatus;
  geolocationFailure: TGeolocationFailure | null;
};
