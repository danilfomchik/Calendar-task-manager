import CalendarIcon from './CalendarIcon';

const NoEventsMessage = () => {
  return (
    <div className="flex flex-col items-center gap-3 pt-8">
      <CalendarIcon className="size-24" />

      <div className="text-xl text-center max-w-[80%]">
        <p className="uppercase">a clear day</p>
        <p>Your schedule is open for new opportunities.</p>
      </div>
    </div>
  );
};

export default NoEventsMessage;
