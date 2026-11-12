import {TGeolocationFailure} from '@/redux/location/types';

// Why the device position could not be read, in words for the Conditions card
export const GEOLOCATION_FAILURE_TEXT: Record<TGeolocationFailure, string> = {
  denied: 'Location access is blocked for this site. Allow it in your browser’s site settings, or choose a city.',
  'no-fix':
    'Your device couldn’t work out its position. Check that location services are on for your browser, or choose a city.',
  timeout: 'Finding your position took too long.',
  unsupported: 'This browser can’t share its location.',
};
