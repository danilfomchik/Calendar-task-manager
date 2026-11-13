import {useEffect, useState} from 'react';

import {TPlace} from '@/redux/conditions/types';
import {requestDeviceLocation, setLocation} from '@/redux/location/locationSlice';
import {TGeolocationFailure} from '@/redux/location/types';
import {useAppDispatch} from '@/redux/store';

import {DayContextBlock} from '../types';
import ConditionsCard from './ConditionsCard';
import ConditionsSkeleton from './ConditionsSkeleton';
import LocationSearch from './LocationSearch';
import SetLocationPrompt from './SetLocationPrompt';
import {getConditionsSourceForToday} from './conditionsRange';
import {useConditionsLocation} from './useConditionsLocation';

// How long the skeleton waits for the device position before offering "Set location". The browser's own
// timeout only starts once the permission prompt is answered, so an ignored prompt would otherwise keep the
// skeleton up for good. The device position still wins if it arrives later.
const DEVICE_LOCATION_WAIT_MS = 4000;

// Conditions: weather, sunrise/sunset and moon phase for the Viewed day at the user's location, else at an
// Approximate location near the browser's time zone. Hidden outside Open-Meteo's range and on failure. Only with
// neither (an unknown time zone, and no position within DEVICE_LOCATION_WAIT_MS) does it show a "Set location"
// prompt that opens a city search; a picked city is persisted and can be changed from the card.
const Conditions: DayContextBlock = ({date}) => {
  const dispatch = useAppDispatch();
  const source = getConditionsSourceForToday(date);
  const {location, isApproximate, geolocationStatus, geolocationFailure} = useConditionsLocation(source !== null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const isWaitingForDevice =
    source !== null && !location && (geolocationStatus === 'pending' || geolocationStatus === 'idle');
  const [hasWaitedTooLong, setHasWaitedTooLong] = useState(false);

  useEffect(() => {
    if (!isWaitingForDevice) return;

    const timeoutId = window.setTimeout(() => setHasWaitedTooLong(true), DEVICE_LOCATION_WAIT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isWaitingForDevice]);

  const openSearch = () => setIsSearching(true);
  const closeSearch = () => {
    setIsSearching(false);
    setHasSearched(true);
  };
  const pickPlace = ({name, region, latitude, longitude}: TPlace) => {
    dispatch(setLocation({latitude, longitude, name: region ? `${name}, ${region}` : name, source: 'city'}));
    closeSearch();
  };

  // The user asking the browser again; resolves to why it failed, or null once the position is saved
  const locateDevice = async (): Promise<TGeolocationFailure | null> => {
    const result = await dispatch(requestDeviceLocation({force: true}));

    if (requestDeviceLocation.fulfilled.match(result)) {
      closeSearch();

      return null;
    }

    return result.payload?.failure ?? 'no-fix';
  };

  if (!source) return null;

  if (isSearching) {
    return <LocationSearch onPick={pickPlace} onLocateDevice={locateDevice} onCancel={closeSearch} />;
  }

  if (location) {
    return (
      <ConditionsCard
        date={date}
        location={location}
        source={source}
        isApproximate={isApproximate}
        onChangeLocation={openSearch}
        focusChange={hasSearched}
      />
    );
  }

  if (isWaitingForDevice && !hasWaitedTooLong) return <ConditionsSkeleton />;

  return (
    <SetLocationPrompt
      geolocationStatus={geolocationStatus}
      geolocationFailure={geolocationFailure}
      onClick={openSearch}
      autoFocus={hasSearched}
    />
  );
};

export default Conditions;
