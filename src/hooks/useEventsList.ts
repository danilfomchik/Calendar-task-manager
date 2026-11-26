import {useSelector} from 'react-redux';

import {selectDayEvents} from '@/redux/events/selectors';
import {TEvent} from '@/redux/events/types';
import {AppStoreState} from '@/redux/store';

type TDayEvents = ReturnType<typeof selectDayEvents>;

// Same day list when every slot holds the same event object, so a fresh array from the selector alone doesn't count
// as a change
const isSameDayEvents = (a: TDayEvents, b: TDayEvents) =>
  a === b || (!!a && !!b && a.length === b.length && a.every((event, index) => event === b[index]));

// The day's events in stored order, or undefined when the date has no entry. Subscribes to that day only: adding,
// editing, moving or deleting an event re-renders the components of the days it touches, not every Month grid cell
export const useEventsList = (date: string): TEvent[] | undefined =>
  useSelector((state: AppStoreState) => selectDayEvents(state, date), isSameDayEvents);
