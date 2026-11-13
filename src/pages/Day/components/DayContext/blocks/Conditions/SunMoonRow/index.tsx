import MoonDisc from '../MoonDisc';
import {TSunMoonRowProps} from './types';

const SunMoonRow = ({data, moon, isSouthern}: TSunMoonRowProps) => (
  <div className="grid grid-cols-3 border-t border-line pt-3 text-center text-xs">
    <div>
      <p className="text-text-faint">Sunrise</p>
      <p className="font-display text-sm font-bold tabular-nums">{data.sunrise ?? '—'}</p>
    </div>
    <div>
      <p className="text-text-faint">Sunset</p>
      <p className="font-display text-sm font-bold tabular-nums">{data.sunset ?? '—'}</p>
    </div>
    <div title={moon.name}>
      <p className="text-text-faint">Moon</p>
      <div className="flex h-5 items-center">
        <MoonDisc fraction={moon.fraction} isSouthern={isSouthern} />
        <span className="sr-only">{moon.name}</span>
      </div>
    </div>
  </div>
);

export default SunMoonRow;
