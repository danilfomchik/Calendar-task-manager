import {formatDaylight, formatRain, formatWind, isSnow} from '../conditionsFormat';
import {TSideFactsProps} from './types';

// Beside the Dial; the first two rows double as its legend (the ring colour and the pointer)
const SideFacts = ({data}: TSideFactsProps) => (
  <dl className="flex min-w-0 flex-1 flex-col gap-2 text-xs">
    <div>
      <dt className="text-text-faint">
        {data.precipitationProbability !== null && <span className="mr-1.5 inline-block size-2 bg-info" aria-hidden />}
        {isSnow(data.weatherCode) ? 'Snow' : 'Rain'}
      </dt>
      <dd className="tabular-nums">{formatRain(data)}</dd>
    </div>
    <div>
      <dt className="text-text-faint">
        <span
          className="mr-1.5 inline-block size-0 border-x-4 border-t-[7px] border-x-transparent border-t-text"
          aria-hidden
        />
        Wind from
      </dt>
      <dd className="tabular-nums">{formatWind(data)}</dd>
    </div>
    <div>
      <dt className="text-text-faint">Daylight</dt>
      <dd className="tabular-nums">{formatDaylight(data)}</dd>
    </div>
  </dl>
);

export default SideFacts;
