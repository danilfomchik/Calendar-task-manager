import {AppStoreState} from '../store';

export const selectLocation = (state: AppStoreState) => state.locationData.location;
export const selectGeolocationStatus = (state: AppStoreState) => state.locationData.geolocationStatus;
export const selectGeolocationFailure = (state: AppStoreState) => state.locationData.geolocationFailure;
