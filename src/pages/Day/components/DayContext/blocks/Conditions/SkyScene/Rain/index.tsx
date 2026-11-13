import {RAIN_WIDTH, SKY_HEIGHT} from '../dimensions';
import {scatter} from '../random';
import {TRainProps} from './types';

const Rain = ({count, heavy}: TRainProps) => (
  <g stroke="#b9d3f2" strokeLinecap="round" strokeWidth={heavy ? 1.4 : 1} opacity={heavy ? 0.7 : 0.55}>
    {Array.from({length: count}, (_, i) => {
      const duration = 0.55 + scatter(i, 2) * 0.35;

      return (
        <line
          key={i}
          className="sky-rain"
          style={{animationDuration: `${duration}s`, animationDelay: `${-scatter(i, 3) * duration}s`}}
          x1={scatter(i, 1) * RAIN_WIDTH}
          y1={scatter(i, 4) * SKY_HEIGHT}
          x2={scatter(i, 1) * RAIN_WIDTH - 4}
          y2={scatter(i, 4) * SKY_HEIGHT + 14}
        />
      );
    })}
  </g>
);

export default Rain;
