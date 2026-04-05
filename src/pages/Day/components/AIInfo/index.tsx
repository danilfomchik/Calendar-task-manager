import {useMemo} from 'react';

import Loading from '@/components/ui/Loading';
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
        <div className="flex flex-col gap-3 bg-[#100d18] px-3 py-2.5 rounded-[10px] border border-[#1e1640]">
          <div className="flex flex-col gap-3 text-sm text-[#9d77f5]">
            <p>{parsedContent.holiday.name}</p>
            {/* TODO: add tooltip with description */}
            {/* <p>{parsedContent.holiday.description}</p> */}
          </div>
        </div>
      )}

      {parsedContent?.fact && (
        <div className="flex flex-col gap-2 border-l-2 border-[#1a1a1a] bg-[#0c0c0c] rounded-r-[6px] px-3 py-2.5">
          <p className="text-sm text-[#444444] uppercase">Did you know</p>
          <p className="text-sm text-gray-400">{parsedContent.fact}</p>
        </div>
      )}
    </>
  );
};

export default AIInfo;
