import {TGeolocationStatus} from '@/redux/location/types';

import ConditionsFrame from '../ConditionsFrame';
import {GEOLOCATION_FAILURE_TEXT} from '../geolocationFailureText';
import {TSetLocationPromptProps} from './types';

const LOCATION_STATUS_TEXT: Partial<Record<TGeolocationStatus, string>> = {
  denied: 'Location access is off.',
  idle: 'Still waiting for your location.',
  pending: 'Still waiting for your location.',
};

const SetLocationPrompt = ({geolocationStatus, geolocationFailure, onClick, autoFocus}: TSetLocationPromptProps) => (
  <ConditionsFrame>
    <p className="text-sm text-text-muted">
      {(geolocationFailure && GEOLOCATION_FAILURE_TEXT[geolocationFailure]) ??
        LOCATION_STATUS_TEXT[geolocationStatus] ??
        'Your location isn’t available.'}{' '}
      Choose a city to see the weather, sunrise and sunset for this day.
    </p>
    <button
      type="button"
      autoFocus={autoFocus}
      onClick={onClick}
      className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 self-start bg-action px-3 font-mono text-xs font-medium tracking-wider text-action-ink uppercase hover:brightness-110 md:h-9">
      Set location
    </button>
  </ConditionsFrame>
);

export default SetLocationPrompt;
