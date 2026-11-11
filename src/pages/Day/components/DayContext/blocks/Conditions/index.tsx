import moment from 'moment';
import {PropsWithChildren, ReactNode, useState} from 'react';

import {useGetDayConditionsQuery} from '@/redux/conditions/conditionsApi';
import {TConditionsSource, TDayConditions, TPlace} from '@/redux/conditions/types';
import {setLocation} from '@/redux/location/locationSlice';
import {TGeolocationStatus, TLocation} from '@/redux/location/types';
import {useAppDispatch} from '@/redux/store';
import {cx} from '@/services/utils';

import {DayContextBlock} from '../types';
import LocationSearch from './LocationSearch';
import {getConditionsSource} from './conditionsRange';
import {getMoonPhase} from './moonPhase';
import {useConditionsLocation} from './useConditionsLocation';
import {describeWeatherCode} from './weatherCode';
import {formatWindDirection} from './wind';

// Skeleton and content share a minimum so the blocks below don't jump when the data arrives
const CARD_MIN_HEIGHT = 'min-h-68';

const Frame = ({children, label, busy = false}: PropsWithChildren<{label?: ReactNode; busy?: boolean}>) => (
  <section
    aria-label="Conditions"
    aria-busy={busy}
    className={cx(
      'flex flex-col gap-3 border border-info/40 bg-linear-to-br from-info/25 via-info/10 to-transparent p-4',
      CARD_MIN_HEIGHT,
    )}>
    <div className="flex items-center justify-between gap-2">
      <span className="font-mono text-[10px] tracking-widest text-info uppercase">Conditions</span>
      {label}
    </div>
    {children}
  </section>
);

const SkeletonLine = ({className}: {className: string}) => (
  <span aria-hidden className={cx('block animate-pulse bg-surface-overlay motion-reduce:animate-none', className)} />
);

const ConditionsSkeleton = () => (
  <Frame busy>
    <span className="sr-only">Loading conditions</span>
    <div className="flex items-end justify-between gap-3">
      <SkeletonLine className="h-9 w-32" />
      <SkeletonLine className="size-8" />
    </div>
    <SkeletonLine className="h-3.5 w-1/2" />
    <div className="flex flex-col gap-2">
      {Array.from({length: 5}, (_, i) => (
        <SkeletonLine key={i} className="h-4.5 w-full" />
      ))}
    </div>
  </Frame>
);

const formatTemperature = (value: number) => `${Math.round(value)}°`;

const formatPrecipitation = ({precipitationSum, precipitationProbability}: TDayConditions) => {
  const amount = `${Math.round(precipitationSum * 10) / 10} mm`;

  return precipitationProbability === null ? amount : `${amount} · ${precipitationProbability}%`;
};

const formatWind = ({windSpeedMax, windDirection}: TDayConditions) =>
  [`${Math.round(windSpeedMax)} km/h`, formatWindDirection(windDirection)].filter(Boolean).join(' ');

const Fact = ({term, children}: PropsWithChildren<{term: string}>) => (
  <div className="flex justify-between gap-2 border-b border-line py-1">
    <dt className="text-text-faint">{term}</dt>
    <dd className="text-right text-text-muted">{children}</dd>
  </div>
);

// autoFocus: set when coming back from the city search, so keyboard focus lands where it started
type TLocationTriggerProps = {onClick: () => void; autoFocus: boolean};

const ChangeLocationButton = ({name, onClick, autoFocus}: TLocationTriggerProps & {name: string | null}) => (
  <div className="flex min-w-0 items-center gap-2">
    {name && (
      <span className="truncate text-xs text-text-muted" title={name}>
        {name}
      </span>
    )}
    <button
      type="button"
      autoFocus={autoFocus}
      onClick={onClick}
      aria-label={name ? `Change location (${name})` : 'Change location'}
      className="inline-flex h-11 shrink-0 cursor-pointer items-center border border-line-strong px-2 font-mono text-[10px] tracking-wider text-text-muted uppercase transition-colors hover:border-text-muted hover:text-text md:h-7">
      Change
    </button>
  </div>
);

const SetLocationPrompt = ({
  geolocationStatus,
  onClick,
  autoFocus,
}: TLocationTriggerProps & {geolocationStatus: TGeolocationStatus}) => (
  <Frame>
    <p className="text-sm text-text-muted">
      {geolocationStatus === 'denied' ? 'Location access is off.' : 'Your location isn’t available.'} Choose a city to
      see the weather, sunrise and sunset for this day.
    </p>
    <button
      type="button"
      autoFocus={autoFocus}
      onClick={onClick}
      className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 self-start bg-action px-3 font-mono text-xs font-medium tracking-wider text-action-ink uppercase hover:brightness-110 md:h-9">
      Set location
    </button>
  </Frame>
);

type TConditionsCardProps = {
  date: string;
  location: TLocation;
  source: TConditionsSource;
  onChangeLocation: () => void;
  focusChange: boolean;
};

const ConditionsCard = ({date, location, source, onChangeLocation, focusChange}: TConditionsCardProps) => {
  const {latitude, longitude} = location;
  const {data, isFetching, isError} = useGetDayConditionsQuery({date, latitude, longitude, source});

  if (isFetching) return <ConditionsSkeleton />;
  if (isError || !data) return null;

  const weather = describeWeatherCode(data.weatherCode);
  const moon = getMoonPhase(date);

  return (
    <Frame label={<ChangeLocationButton name={location.name} onClick={onChangeLocation} autoFocus={focusChange} />}>
      <div className="flex items-end justify-between gap-3">
        <p className="font-display text-4xl leading-none font-extrabold">
          <span className="sr-only">Low </span>
          {formatTemperature(data.temperatureMin)}
          <span className="text-text-faint" aria-hidden>
            {' / '}
          </span>
          <span className="sr-only">, high </span>
          {formatTemperature(data.temperatureMax)}
        </p>
        <span aria-hidden className="text-3xl leading-none">
          {weather.glyph}
        </span>
      </div>
      <p className="text-sm text-text-muted">{weather.label}</p>
      <dl className="flex flex-col font-mono text-[11px] tracking-wider uppercase">
        <Fact term="Precip">{formatPrecipitation(data)}</Fact>
        <Fact term="Wind">{formatWind(data)}</Fact>
        <Fact term="Sunrise">{data.sunrise ?? '—'}</Fact>
        <Fact term="Sunset">{data.sunset ?? '—'}</Fact>
        <Fact term="Moon">
          <span aria-hidden>{moon.glyph} </span>
          {moon.name}
        </Fact>
      </dl>
    </Frame>
  );
};

// Conditions: weather, sunrise/sunset and moon phase for the Viewed day at the user's location.
// Hidden outside Open-Meteo's range and on failure. Without a location (denied or unavailable) it shows a
// "Set location" prompt that opens a city search; a picked city is persisted and can be changed from the card.
const Conditions: DayContextBlock = ({date}) => {
  const dispatch = useAppDispatch();
  const source = getConditionsSource(date, moment().format('YYYY-MM-DD'));
  const {location, geolocationStatus} = useConditionsLocation(source !== null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const openSearch = () => setIsSearching(true);
  const closeSearch = () => {
    setIsSearching(false);
    setHasSearched(true);
  };
  const pickPlace = ({name, region, latitude, longitude}: TPlace) => {
    dispatch(setLocation({latitude, longitude, name: region ? `${name}, ${region}` : name, source: 'city'}));
    closeSearch();
  };

  if (!source) return null;

  if (isSearching) {
    return (
      <Frame>
        <LocationSearch onPick={pickPlace} onCancel={closeSearch} />
      </Frame>
    );
  }

  if (location) {
    return (
      <ConditionsCard
        date={date}
        location={location}
        source={source}
        onChangeLocation={openSearch}
        focusChange={hasSearched}
      />
    );
  }

  if (geolocationStatus === 'pending' || geolocationStatus === 'idle') return <ConditionsSkeleton />;

  return <SetLocationPrompt geolocationStatus={geolocationStatus} onClick={openSearch} autoFocus={hasSearched} />;
};

export default Conditions;
