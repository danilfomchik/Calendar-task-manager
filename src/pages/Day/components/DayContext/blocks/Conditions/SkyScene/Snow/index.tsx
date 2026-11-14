import {SKY_HEIGHT, SKY_WIDTH} from '../dimensions';
import {scatter} from '../random';
import {TSnowProps} from './types';

const Snow = ({count}: TSnowProps) => (
  <g fill="#f4f8ff" opacity="0.85">
    {Array.from({length: count}, (_, i) => {
      const duration = 5 + scatter(i, 2) * 4;

      return (
        <circle
          key={i}
          className="sky-snow"
          style={{animationDuration: `${duration}s`, animationDelay: `${-scatter(i, 3) * duration}s`}}
          cx={scatter(i, 1) * SKY_WIDTH}
          cy={scatter(i, 4) * SKY_HEIGHT}
          r={0.9 + scatter(i, 5) * 1.6}
        />
      );
    })}
  </g>
);

export default Snow;
