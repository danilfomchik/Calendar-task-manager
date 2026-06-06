import {cx} from '@/services/utils';

const Loading = ({className = ''}) => {
  return (
    <div className={cx('flex items-center justify-center self-center w-8 h-8', className)}>
      <div className="relative inline-flex items-center justify-center w-full h-full">
        {/* Background track - light blue full circle */}
        <svg className="absolute" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" stroke="var(--blue-wave-light)" strokeWidth={3} fill="none" />
        </svg>

        {/* Rotating arc - blue partial circle */}
        <svg
          className="absolute animate-spin"
          style={{animationDuration: '1s'}}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="#5479f7"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
            strokeDasharray="22 66"
            transform="rotate(-90 16 16)"
          />
        </svg>
      </div>
    </div>
  );
};

export default Loading;
