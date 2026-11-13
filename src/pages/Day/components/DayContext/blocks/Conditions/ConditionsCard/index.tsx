import {useGetDayConditionsQuery, useGetPlaceNameQuery} from '@/redux/conditions/conditionsApi';
import {TDayConditions} from '@/redux/conditions/types';

import ChangeLocationButton from '../ChangeLocationButton';
import ConditionsFrame from '../ConditionsFrame';
import ConditionsSkeleton from '../ConditionsSkeleton';
import Fact from '../Fact';
import {getMoonPhase} from '../moonPhase';
import {describeWeatherCode} from '../weatherCode';
import {formatWindDirection} from '../wind';
import {TConditionsCardProps} from './types';

const formatTemperature = (value: number) => `${Math.round(value)}°`;

const formatPrecipitation = ({precipitationSum, precipitationProbability}: TDayConditions) => {
  const amount = `${Math.round(precipitationSum * 10) / 10} mm`;

  return precipitationProbability === null ? amount : `${amount} · ${precipitationProbability}%`;
};

const formatWind = ({windSpeedMax, windDirection}: TDayConditions) =>
  [`${Math.round(windSpeedMax)} km/h`, formatWindDirection(windDirection)].filter(Boolean).join(' ');

const ConditionsCard = ({
  date,
  location,
  source,
  isApproximate,
  onChangeLocation,
  focusChange,
}: TConditionsCardProps) => {
  const {latitude, longitude} = location;
  const {data, isFetching, isError} = useGetDayConditionsQuery({date, latitude, longitude, source});
  // A device position has no name of its own: look the city up (the card shows the weather meanwhile)
  const {data: placeName} = useGetPlaceNameQuery({latitude, longitude}, {skip: location.source !== 'device'});

  if (isFetching) return <ConditionsSkeleton />;
  if (isError || !data) return null;

  const weather = describeWeatherCode(data.weatherCode);
  const moon = getMoonPhase(date);

  return (
    <ConditionsFrame
      label={
        <ChangeLocationButton
          name={location.name ?? placeName ?? null}
          isApproximate={isApproximate}
          onClick={onChangeLocation}
          autoFocus={focusChange}
        />
      }>
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
    </ConditionsFrame>
  );
};

export default ConditionsCard;
