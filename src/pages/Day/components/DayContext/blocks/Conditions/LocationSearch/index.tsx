import {FormEvent, useId, useState} from 'react';

import {useSearchPlacesQuery} from '@/redux/conditions/conditionsApi';
import {TGeolocationFailure} from '@/redux/location/types';
import {cx} from '@/services/utils';

import ConditionsFrame from '../ConditionsFrame';
import {formatCoordinates} from '../conditionsFormat';
import {GEOLOCATION_FAILURE_TEXT} from '../geolocationFailureText';
import CompassIcon from './CompassIcon';
import CrosshairIcon from './CrosshairIcon';
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
  if (deviceFailure) message = GEOLOCATION_FAILURE_TEXT[deviceFailure];
  else if (isTooShort) message = `Type at least ${MIN_QUERY_LENGTH} letters.`;
  else if (isFetching) message = 'Searching…';
  else if (isError) message = 'Couldn’t reach the city search. Check your connection and try again.';
  else if (places?.length === 0) message = `No places found for “${query}”. Check the spelling or try a nearby city.`;

  const showPlaces = !isTooShort && !isFetching && !isError && !!places?.length;

  return (
    <ConditionsFrame
      label={
        <button
          type="button"
          onClick={onCancel}
          className="h-8 cursor-pointer px-1 text-xs text-text-muted underline-offset-2 hover:text-text hover:underline">
          Cancel
        </button>
      }>
      <form role="search" onSubmit={onSubmit} className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-xs text-text-muted">
          Find a city for the weather
        </label>
        <div className="flex h-11 border border-line-strong bg-surface-base/90 focus-within:border-info md:h-10">
          <CompassIcon className="ml-3 size-4 shrink-0 self-center text-text-faint" />
          <input
            id={inputId}
            type="search"
            autoFocus
            autoComplete="off"
            enterKeyHint="search"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Lisbon, Osaka, Quito…"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none focus-visible:outline-none! placeholder:text-text-faint"
          />
          <button
            type="submit"
            className="shrink-0 cursor-pointer bg-info px-3 text-xs font-semibold text-info-ink hover:brightness-110">
            Search
          </button>
        </div>
      </form>

      <button
        type="button"
        disabled={isLocating}
        onClick={locateDevice}
        className="flex h-10 w-full cursor-pointer items-center gap-2 border border-line px-3 text-left text-sm hover:bg-surface-overlay disabled:cursor-default">
        <CrosshairIcon className={cx('size-4 shrink-0', isLocating && 'animate-pulse motion-reduce:animate-none')} />
        <span className="flex-1">{isLocating ? 'Waiting for your device…' : 'Use my location'}</span>
      </button>

      <p role="status" className="text-xs text-text-muted empty:hidden">
        {message}
      </p>

      {showPlaces && (
        <ul aria-label="Places" className="-mx-1 flex flex-col">
          {places.map(place => (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => onPick(place)}
                className="group flex min-h-11 w-full cursor-pointer items-center gap-3 border-b border-line px-1 py-1.5 text-left hover:bg-surface-overlay">
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-semibold">{place.name}</span>
                  {place.region && <span className="truncate text-xs text-text-faint">{place.region}</span>}
                </span>
                <span className="flex shrink-0 flex-col font-mono text-[10px] text-text-faint tabular-nums group-hover:text-info">
                  <span>{formatCoordinates(place.latitude, place.longitude).latitude}</span>
                  <span>{formatCoordinates(place.latitude, place.longitude).longitude}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </ConditionsFrame>
  );
};

export default LocationSearch;
