import CalendarIcon from './CalendarIcon';

const NoEventsMessage = () => {
  return (
    <div className="flex flex-col items-center gap-3 pt-8">
      <CalendarIcon className="size-24" />

      <div className="text-center max-w-[80%]">
        <p className="uppercase text-xl md:text-2xl font-bold">a clear day</p>
        <p>Your schedule is open for new opportunities.</p>
      </div>
    </div>
  );
};

export default NoEventsMessage;
