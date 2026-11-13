import {formatTemperature} from '../conditionsFormat';
import {TTemperaturesProps} from './types';

// The day's high over its low, white on the Dial's face
const Temperatures = ({high, low}: TTemperaturesProps) => (
  <span className="flex flex-col items-center text-white">
    <span className="font-display text-3xl leading-none font-extrabold tabular-nums drop-shadow-[0_1px_6px_rgb(0_0_0/0.5)]">
      <span className="sr-only">High </span>
      {formatTemperature(high)}
    </span>
    <span className="text-xs text-white/85 tabular-nums drop-shadow">
      <span className="sr-only">Low </span>
      {formatTemperature(low)}
    </span>
  </span>
);

export default Temperatures;
