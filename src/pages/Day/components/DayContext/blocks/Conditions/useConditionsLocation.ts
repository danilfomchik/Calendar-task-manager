import {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {requestDeviceLocation} from '@/redux/location/locationSlice';
import {selectGeolocationStatus, selectLocation} from '@/redux/location/selectors';
import {useAppDispatch} from '@/redux/store';

// The location Conditions are shown for: a persisted one (device position or a picked city), else the
// device position asked from the browser once (the thunk's condition makes repeat calls no-ops).
// Pass enabled=false to avoid prompting for a day that would show nothing anyway.
export const useConditionsLocation = (enabled: boolean) => {
  const dispatch = useAppDispatch();
  const location = useSelector(selectLocation);
  const geolocationStatus = useSelector(selectGeolocationStatus);

  useEffect(() => {
    if (enabled) dispatch(requestDeviceLocation());
  }, [dispatch, enabled]);

  return {location, geolocationStatus};
};
