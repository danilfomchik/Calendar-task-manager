import {FormEvent, useId, useState} from 'react';

import {useSearchPlacesQuery} from '@/redux/conditions/conditionsApi';
import {TGeolocationFailure} from '@/redux/location/types';
import {HAIRLINE_CONTROL_CLASS} from '@/services/styles';
import {cx} from '@/services/utils';

import {GEOLOCATION_FAILURE_TEXT} from '../geolocationFailureText';
import {TLocationSearchProps} from './types';

// Open-Meteo returns nothing for 0-1 characters, so don't send those
const MIN_QUERY_LENGTH = 2;

// City search for the Conditions location: type a name, submit, pick one of up to 5 places.
// Searches on submit (Enter or the button), not per keystroke, so typing sends nothing.
const LocationSearch = ({onPick, onLocateDevice, onCancel}: TLocationSearchProps) => {
  const inputId = useId();
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [isTooShort, setIsTooShort] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [deviceFailure, setDeviceFailure] = useState<TGeolocationFailure | null>(null);

  const locateDevice = async () => {
    setIsLocating(true);
    setDeviceFailure(null);

    const failure = await onLocateDevice();

    // on success the search is closed and this component is gone
    setIsLocating(false);
    setDeviceFailure(failure);
  };

  const {data: places, isFetching, isError, refetch} = useSearchPlacesQuery(query, {skip: !query});

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name = text.trim();

    setIsTooShort(name.length < MIN_QUERY_LENGTH);
    if (name.length < MIN_QUERY_LENGTH) return;

    // The same text again is a retry (e.g. after a failed request)
    if (name === query) refetch();
    else setQuery(name);
  };

  let message = '';
  if (isLocating) message = 'Waiting for your device…';
  else if (deviceFailure) message = GEOLOCATION_FAILURE_TEXT[deviceFailure];
  else if (isTooShort) message = `Type at least ${MIN_QUERY_LENGTH} letters.`;
  else if (isFetching) message = 'Searching…';
  else if (isError) message = 'Couldn’t reach the city search. Check your connection and try again.';
  else if (places?.length === 0) message = `No places found for “${query}”. Check the spelling or try a nearby city.`;

  const showPlaces = !isTooShort && !isFetching && !isError && !!places?.length;

  return (
    <div className="flex flex-col gap-3">
      <form role="search" onSubmit={onSubmit} className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-sm text-text-muted">
          Find a city for the weather
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            type="search"
            autoFocus
            autoComplete="off"
            enterKeyHint="search"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="e.g. Lisbon"
            className="h-11 min-w-0 flex-1 border border-line-strong bg-surface-base px-3 text-sm placeholder:text-text-faint md:h-9"
          />
          <button type="submit" className={cx(HAIRLINE_CONTROL_CLASS, 'shrink-0')}>
            Search
          </button>
        </div>
      </form>

      <button
        type="button"
        disabled={isLocating}
        onClick={locateDevice}
        className={cx(HAIRLINE_CONTROL_CLASS, 'self-start disabled:cursor-default disabled:opacity-60')}>
        <span aria-hidden>◎</span> Use my location
      </button>

      <p role="status" className="text-sm text-text-muted empty:hidden">
        {message}
      </p>

      {showPlaces && (
        <ul aria-label="Places" className="flex flex-col">
          {places.map(place => (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => onPick(place)}
                className="flex min-h-11 w-full cursor-pointer flex-col justify-center border-b border-line px-1 py-1.5 text-left transition-colors hover:bg-surface-overlay">
                <span className="text-sm font-semibold">{place.name}</span>
                {place.region && (
                  <span className="font-mono text-[11px] tracking-wider text-text-faint uppercase">{place.region}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onCancel}
        className="min-h-11 cursor-pointer self-start font-mono text-[11px] tracking-wider text-text-faint uppercase underline-offset-2 hover:text-text hover:underline md:min-h-8">
        Cancel
      </button>
    </div>
  );
};

export default LocationSearch;
