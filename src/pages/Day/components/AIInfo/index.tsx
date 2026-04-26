import classNames from 'classnames';
import {useMemo} from 'react';

import Loading from '@/components/ui/Loading';
import Tooltip from '@/components/ui/Tooltip';
import InfoIcon from '@/components/ui/icons/InfoIcon';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {useGetDayHolidaysInfoQuery} from '@/redux/dateHolidaysGenerator/holidaysApi';

import {IParsedContent} from './types';

const AIInfo = ({date}: {date: string | undefined}) => {
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
  if (isLoading) return <Loading />;

  return (
    <>
      {parsedContent?.holiday && (
        <div className="flex flex-col gap-3 bg-[#100d18] px-3 py-2.5 rounded-[10px] border border-[#1e1640] w-fit">
          <div className="flex items-center justify-between gap-3 text-sm text-[#9d77f5]">
            <p className="font-medium">{parsedContent.holiday.name}</p>
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
        <div className="flex flex-col gap-2 border-l-2 border-[#262626] bg-[#101010] rounded-r-[6px] px-3 py-2.5">
          <p className="text-sm font-medium text-[#444444] uppercase">Did you know</p>
          <p className="text-sm text-gray-400">{parsedContent.fact}</p>
        </div>
      )}
    </>
  );
};

export default AIInfo;
