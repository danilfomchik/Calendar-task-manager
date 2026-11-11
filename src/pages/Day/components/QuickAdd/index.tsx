import {FormEvent, useRef, useState} from 'react';
import {useSelector} from 'react-redux';

import {addEvent} from '@/redux/events/eventsSlice';
import {selectActiveCalendars, selectCalendarsList} from '@/redux/myCalendars/selectors';
import {useAppDispatch} from '@/redux/store';
import {createEventObj} from '@/services/eventUtils';
import {cx} from '@/services/utils';
import {CalendarsNames} from '@/types/types';

// Calendar last used with Quick add in this session (module state: survives day navigation, not a reload)
let lastUsedCalendar: CalendarsNames | null = null;

// Quick add: a title plus a calendar choice; Enter adds the event on the Viewed day through `addEvent`,
// the same action as the full form, so persistence and the calendar event-count map stay in sync.
// Default calendar: the single Active calendar, else the last one used with Quick add, else the first calendar.
const QuickAdd = ({date}: {date: string}) => {
  const dispatch = useAppDispatch();
  const activeCalendars = useSelector(selectActiveCalendars);
  const calendarsList = useSelector(selectCalendarsList);
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  // An explicit pick holds only while the Calendar filter it was made under is unchanged
  const filterKey = activeCalendars.join('|');
  const [picked, setPicked] = useState<{calendar: CalendarsNames; filterKey: string} | null>(null);

  const defaultCalendar =
    activeCalendars.length === 1 ? activeCalendars[0] : (lastUsedCalendar ?? calendarsList[0].name);
  const calendar = picked?.filterKey === filterKey ? picked.calendar : defaultCalendar;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    inputRef.current?.focus();

    if (!title.trim()) return;

    dispatch(addEvent(createEventObj({title, date, eventCalendar: calendar})));
    lastUsedCalendar = calendar;
    setTitle('');
  };

  return (
    <form
      aria-label="Quick add"
      onSubmit={handleSubmit}
      className="flex min-h-12 flex-wrap items-center gap-x-3 border border-line-strong bg-surface-sunken pl-3 transition-colors focus-within:border-text-muted has-[>input:focus-visible]:outline-2 has-[>input:focus-visible]:outline-offset-2 has-[>input:focus-visible]:outline-action">
      <input
        ref={inputRef}
        value={title}
        onChange={e => setTitle(e.target.value)}
        aria-label={`Event title, adds to ${calendar}`}
        placeholder={`Add to ${calendar}, press Enter`}
        enterKeyHint="done"
        className="h-11 min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-text-faint focus-visible:outline-none!"
      />

      <fieldset className="flex items-center">
        <legend className="sr-only">Calendar</legend>
        <span aria-hidden className="mr-1 font-mono text-[11px] tracking-wider text-text-muted uppercase max-sm:hidden">
          {calendar}
        </span>

        {calendarsList.map(({name, itemColor}) => {
          const isChecked = name === calendar;

          return (
            <label
              key={name}
              title={name}
              style={{'--calendar-color': itemColor} as React.CSSProperties}
              className="flex size-11 cursor-pointer items-center justify-center md:size-8">
              <input
                type="radio"
                name="quick-add-calendar"
                value={name}
                checked={isChecked}
                onChange={() => setPicked({calendar: name, filterKey})}
                className="peer sr-only"
              />
              <span className="sr-only">{name}</span>
              <span
                aria-hidden
                className={cx(
                  'flex size-4 items-center justify-center rounded-full border-2 border-(--calendar-color) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-action',
                  isChecked ? 'bg-(--calendar-color)' : 'bg-transparent',
                )}>
                {isChecked && <span className="size-1.5 rounded-full bg-surface-sunken" />}
              </span>
            </label>
          );
        })}
      </fieldset>
    </form>
  );
};

export default QuickAdd;
