import {useMemo} from 'react';

import Loading from '@/components/Loading';
import {useGetDayHolidaysInfoQuery} from '@/redux/dateHolidaysGenerator/holidaysApi';

import {IParsedContent, THoliday} from './types';

const HolidayItem = ({name, description}: THoliday) => {
  return (
    <div className="flex flex-col gap-3">
      <p>{name}</p>
      <p>{description}</p>
    </div>
  );
};

const AIInfo = ({date}: {date: string | undefined}) => {
  const {data, isLoading, error} = useGetDayHolidaysInfoQuery(date, {
    skip: !date,
  });

  const content = data?.choices[0]?.message?.content;

  const parsedContent: IParsedContent | null = useMemo(() => {
    if (isLoading) return null;

    return content ? JSON.parse(content) : null;
  }, [content, isLoading]);

  const isGroqEnabled = import.meta.env.VITE_REACT_APP_IS_GROQ_ENABLED === 'true';

  if (error || !isGroqEnabled) return null;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto scroll-smooth">
      {parsedContent?.fact && (
        <>
          <p>Fun fact</p>
          <div className="border border-violet-500 px-4 py-3 rounded-md mb-4">
            {isLoading ? <Loading /> : parsedContent.fact}
          </div>
        </>
      )}

      {parsedContent?.holidays && (
        <>
          <p>Holidays</p>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="flex flex-col gap-3 divide-y-2 not-first:pt-3">
              {parsedContent?.holidays?.map(holiday => (
                <HolidayItem key={holiday.name} name={holiday.name} description={holiday.description} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIInfo;
