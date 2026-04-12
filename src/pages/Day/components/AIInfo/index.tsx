import {useMemo} from 'react';

import Loading from '@/components/ui/Loading';
import InfoIcon from '@/components/ui/icons/InfoIcon';
import {useGetDayHolidaysInfoQuery} from '@/redux/dateHolidaysGenerator/holidaysApi';

import {IParsedContent} from './types';

const AIInfo = ({date}: {date: string | undefined}) => {
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
            <InfoIcon className="size-4" />
            {/* TODO: add tooltip with description */}
            {/* <Tooltip triggerElement={<InfoIcon className="size-4" />} className="w-auto min-w-[25px] flex justify-end">
              <p>{parsedContent.holiday.description}</p>
            </Tooltip> */}
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
