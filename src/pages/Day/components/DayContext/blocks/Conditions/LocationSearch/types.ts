import {TPlace} from '@/redux/conditions/types';
import {TGeolocationFailure} from '@/redux/location/types';

export type TLocationSearchProps = {
  onPick: (place: TPlace) => void;
  // asks the browser for the device position again; resolves to why it failed, or null when it worked
  onLocateDevice: () => Promise<TGeolocationFailure | null>;
  onCancel: () => void;
};
