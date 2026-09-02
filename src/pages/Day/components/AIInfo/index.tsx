import classNames from 'classnames';
import {useMemo} from 'react';

import Divider from '@/components/ui/Divider';
import Loading from '@/components/ui/Loading';
import Tooltip from '@/components/ui/Tooltip';
import InfoIcon from '@/components/ui/icons/InfoIcon';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {useGetDayHolidaysInfoQuery} from '@/redux/dateHolidaysGenerator/holidaysApi';
import {cx} from '@/services/utils';

import {IParsedContent} from './types';

const AIInfo = ({date, className = ''}: {date: string | undefined; className?: string}) => {
  const isMobileScreen = useMediaQuery({size: 'md', direction: 'to'});
  const {data, isLoading, error} = useGetDayHolidaysInfoQuery(date, {
    skip: !date,
  });

  const content = data?.choices[0]?.message?.content;

  const parsedContent: IParsedContent | null = useMemo(() => {
    if (isLoading) return null;

    return content ? JSON.parse(content) : null;
  }, [content, isLoading]);

  if (error) return null;

  return (
    <div className={cx('flex flex-col gap-2 md:gap-3', className)}>
      {isLoading || parsedContent ? (
        <Divider>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4A6CF7] animate-pulse"></div>
            <p className="text-xs text-[#444444] uppercase">ai insights</p>
          </div>
        </Divider>
      ) : null}

      {isLoading && <Loading />}

      {parsedContent?.holiday && (
        <div className="flex flex-col gap-3 bg-[#100d18] px-2.5 md:px-3 py-2 md:py-2.5 rounded-[10px] border border-[#1e1640] w-fit">
          <div className="flex items-center justify-between gap-3 text-sm text-[#9d77f5]">
            <p className="max-md:text-[11px]/[1.5] font-medium">{parsedContent.holiday.name}</p>
            <Tooltip
              disabled={isMobileScreen}
              triggerElement={
                <div className={classNames({'cursor-help': !isMobileScreen})}>
                  <InfoIcon className="size-4 shrink-0" />
                </div>
              }
              contentClassName="w-auto min-w-[200px] max-w-none flex justify-end border-[#9d77f5]">
              <p className="text-xs text-white">{parsedContent.holiday.description}</p>
            </Tooltip>
          </div>
        </div>
      )}

      {parsedContent?.fact && (
        <div className="flex flex-col gap-1 md:gap-2 border-l-2 border-[#262626] bg-[#101010] rounded-r-md px-2 md:px-3 py-1.5 md:py-2.5">
          <p className="text-[11px]/[1.5] md:text-sm font-medium text-[#444444] uppercase">Did you know</p>
          <p className="text-[11px]/[1.5] md:text-sm text-gray-400">{parsedContent.fact}</p>
        </div>
      )}
    </div>
  );
};

export default AIInfo;
