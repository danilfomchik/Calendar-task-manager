import {useEffect, useMemo} from 'react';
import {useSelector} from 'react-redux';

import {getApproximateLocation} from '@/redux/location/helpers';
import {requestDeviceLocation} from '@/redux/location/locationSlice';
import {selectGeolocationFailure, selectGeolocationStatus, selectLocation} from '@/redux/location/selectors';
import {useAppDispatch} from '@/redux/store';

// The location Conditions are shown for: the saved one (device position or a picked city), else the Approximate
// location near the browser's time zone. The device position is also asked from the browser once (the thunk's
// condition makes repeat calls no-ops) and replaces the approximate one whenever it arrives.
// Pass enabled=false to avoid prompting for a day that would show nothing anyway.
export const useConditionsLocation = (enabled: boolean) => {
  const dispatch = useAppDispatch();
  const savedLocation = useSelector(selectLocation);
  const geolocationStatus = useSelector(selectGeolocationStatus);
  const geolocationFailure = useSelector(selectGeolocationFailure);
  const approximateLocation = useMemo(() => getApproximateLocation(), []);

  useEffect(() => {
    if (enabled) dispatch(requestDeviceLocation());
  }, [dispatch, enabled]);

  return {
    location: savedLocation ?? approximateLocation,
    isApproximate: !savedLocation && !!approximateLocation,
    geolocationStatus,
    geolocationFailure,
  };
};
