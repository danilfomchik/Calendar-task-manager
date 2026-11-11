import moment from 'moment';
import {PropsWithChildren, ReactNode} from 'react';

import {useGetDayConditionsQuery} from '@/redux/conditions/conditionsApi';
import {TConditionsSource, TDayConditions} from '@/redux/conditions/types';
import {TLocation} from '@/redux/location/types';
import {cx} from '@/services/utils';

import {DayContextBlock} from '../types';
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

type TConditionsCardProps = {date: string; location: TLocation; source: TConditionsSource};

const ConditionsCard = ({date, location, source}: TConditionsCardProps) => {
  const {latitude, longitude} = location;
  const {data, isFetching, isError} = useGetDayConditionsQuery({date, latitude, longitude, source});

  if (isFetching) return <ConditionsSkeleton />;
  if (isError || !data) return null;

  const weather = describeWeatherCode(data.weatherCode);
  const moon = getMoonPhase(date);

  return (
    <Frame label={location.name && <span className="truncate text-xs text-text-muted">{location.name}</span>}>
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
// Hidden outside Open-Meteo's range, without a location (#76 adds the city fallback here) and on failure.
const Conditions: DayContextBlock = ({date}) => {
  const source = getConditionsSource(date, moment().format('YYYY-MM-DD'));
  const {location, geolocationStatus} = useConditionsLocation(source !== null);

  if (!source) return null;
  if (location) return <ConditionsCard date={date} location={location} source={source} />;
  if (geolocationStatus === 'pending') return <ConditionsSkeleton />;

  return null;
};

export default Conditions;
