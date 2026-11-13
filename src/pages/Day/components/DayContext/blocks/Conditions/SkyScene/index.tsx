import {useId} from 'react';

import {cx} from '@/services/utils';

import {TSkyKind} from '../weatherCode';
import Cloud from './Cloud';
import Rain from './Rain';
import Snow from './Snow';
import Sun from './Sun';
import {SKY_HEIGHT, SKY_WIDTH} from './dimensions';
import {scatter} from './random';
import {TSkySceneProps} from './types';

// [top, bottom] of each sky's gradient, tuned to sit in the dark UI. Illustration colours, not UI tokens.
const SKY_COLORS: Record<TSkyKind, [string, string]> = {
  clear: ['#0a3474', '#3f8ee0'],
  partly: ['#103a70', '#5a8cc4'],
  overcast: ['#1c242e', '#485361'],
  fog: ['#272e37', '#6c7682'],
  rain: ['#0c1726', '#29405a'],
  snow: ['#253041', '#7a8a9f'],
  storm: ['#0c0a17', '#2b2443'],
  night: ['#0d1014', '#17212d'],
};

// The illustrated sky for the day's weather. Pure SVG, drawn for a 300x200 view cropped to its centre by the Dial's
// round face; the motion is CSS (index.css).
const SkyScene = ({kind, label, className}: TSkySceneProps) => {
  const id = useId().replace(/:/g, '');
  const [top, bottom] = SKY_COLORS[kind];
  const skyId = `${id}-sky`;
  const glowId = `${id}-glow`;
  const blurId = `${id}-blur`;

  return (
    <svg
      viewBox={`0 0 ${SKY_WIDTH} ${SKY_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      className={cx('sky-scene size-full', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}>
      {label && <title>{label}</title>}
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <radialGradient id={glowId}>
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.75" />
          <stop offset="0.35" stopColor="#ffc25c" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ffc25c" stopOpacity="0" />
        </radialGradient>
        <filter id={blurId} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <rect width={SKY_WIDTH} height={SKY_HEIGHT} fill={`url(#${skyId})`} />

      {kind === 'clear' && <Sun x={198} y={58} glowId={glowId} />}

      {kind === 'partly' && (
        <>
          <Sun x={186} y={60} glowId={glowId} />
          <Cloud x={150} y={96} scale={1.15} fill="#e6edf6" opacity={0.92} drift={18} />
          <Cloud x={46} y={58} scale={0.75} fill="#c9d6e6" opacity={0.7} drift={26} />
        </>
      )}

      {kind === 'overcast' && (
        <>
          <Cloud x={-10} y={40} scale={1.6} fill="#5d6977" drift={30} />
          <Cloud x={130} y={30} scale={1.8} fill="#6b7785" drift={24} />
          <Cloud x={50} y={92} scale={1.5} fill="#7b8794" drift={20} />
          <Cloud x={190} y={110} scale={1.3} fill="#8995a2" opacity={0.9} drift={28} />
        </>
      )}

      {kind === 'fog' &&
        [50, 90, 130, 165].map((y, i) => (
          <g key={y} className="sky-drift" style={{animationDuration: `${14 + i * 5}s`}}>
            <rect
              x="-40"
              y={y}
              width="380"
              height="18"
              rx="9"
              fill="#c7ced6"
              opacity={0.18 + i * 0.07}
              filter={`url(#${blurId})`}
            />
          </g>
        ))}

      {(kind === 'rain' || kind === 'storm') && (
        <>
          <Rain count={kind === 'storm' ? 46 : 34} heavy={kind === 'storm'} />
          <Cloud x={-20} y={28} scale={1.7} fill={kind === 'storm' ? '#211c33' : '#1f2d40'} drift={22} />
          <Cloud x={140} y={20} scale={1.9} fill={kind === 'storm' ? '#2a2440' : '#26364b'} drift={27} />
        </>
      )}

      {kind === 'storm' && (
        <g className="sky-flash">
          <rect width={SKY_WIDTH} height={SKY_HEIGHT} fill="#d9d2ff" opacity="0.18" />
          <path d="M168 62 L150 108 L166 108 L152 150 L186 96 L170 96 L184 62 Z" fill="#fff6d0" />
        </g>
      )}

      {kind === 'snow' && (
        <>
          <Cloud x={-10} y={32} scale={1.6} fill="#9aa8ba" opacity={0.85} drift={30} />
          <Cloud x={150} y={26} scale={1.7} fill="#aab7c7" opacity={0.85} drift={24} />
          <Snow count={48} />
        </>
      )}

      {kind === 'night' && (
        <g fill="#cfe0ff">
          {Array.from({length: 26}, (_, i) => (
            <circle
              key={i}
              className="sky-twinkle"
              style={{animationDuration: `${2 + scatter(i, 7) * 3}s`, animationDelay: `${-scatter(i, 8) * 3}s`}}
              cx={scatter(i, 5) * SKY_WIDTH}
              cy={scatter(i, 6) * SKY_HEIGHT}
              r={0.5 + scatter(i, 9) * 0.9}
            />
          ))}
        </g>
      )}
    </svg>
  );
};

export default SkyScene;
