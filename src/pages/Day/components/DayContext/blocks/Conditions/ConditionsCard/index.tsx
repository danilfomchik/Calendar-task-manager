import {useGetDayConditionsQuery, useGetPlaceNameQuery} from '@/redux/conditions/conditionsApi';

import ChangeLocationButton from '../ChangeLocationButton';
import ConditionsFrame from '../ConditionsFrame';
import ConditionsSkeleton from '../ConditionsSkeleton';
import Dial from '../Dial';
import SideFacts from '../SideFacts';
import SkyScene from '../SkyScene';
import SunMoonRow from '../SunMoonRow';
import Temperatures from '../Temperatures';
import {getMoonPhase} from '../moonPhase';
import {describeWeatherCode, getSkyKind} from '../weatherCode';
import {TConditionsCardProps} from './types';

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
      <div className="flex items-center gap-4">
        <Dial
          rainChance={data.precipitationProbability}
          windDirection={data.windDirection}
          face={<SkyScene kind={getSkyKind(data.weatherCode)} label={describeWeatherCode(data.weatherCode).label} />}>
          <Temperatures high={data.temperatureMax} low={data.temperatureMin} />
        </Dial>
        <SideFacts data={data} />
      </div>
      <SunMoonRow data={data} moon={getMoonPhase(date)} isSouthern={latitude < 0} />
    </ConditionsFrame>
  );
};

export default ConditionsCard;
